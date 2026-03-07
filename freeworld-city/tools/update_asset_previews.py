#!/home/Marcel/dev/browser/.venv/bin/python
from __future__ import annotations

import argparse
import json
import math
import os
from pathlib import Path
import re
import subprocess
import sys
import time
import urllib.parse
import urllib.request

REPO_ROOT = Path("/home/Marcel/dev/githupio")
SITE_ROOT = REPO_ROOT / "freeworld-city"
FREEWORLD_ROOT = Path("/home/Marcel/dev/freeworld")
FREEWORLD_PYTHON = FREEWORLD_ROOT / ".venv" / "bin" / "python"
BROWSER_SRC = Path("/home/Marcel/dev/browser/src")
PREVIEW_ROOT = SITE_ROOT / "asset-previews"
MANIFEST_PATH = PREVIEW_ROOT / "manifest.json"
SERVER_URL = "http://127.0.0.1:8012"
WORLD_NAME = "leonardos-world"
PRESET = "city"
VIEW_NAMES = ("hero", "corner", "reverse")
VIEW_ANGLE_OFFSETS_DEG = (0.0, 120.0, -120.0)

sys.path.insert(0, str(BROWSER_SRC))
from playwright.sync_api import sync_playwright  # type: ignore  # noqa: E402


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Precompute asset preview renders into the static Pages repo.")
    parser.add_argument("--limit", type=int, default=0, help="Only render the first N assets.")
    parser.add_argument("--max-wait", type=float, default=2.5, help="Max seconds to wait per focused object load.")
    parser.add_argument("--post-wait", type=float, default=0.18, help="Extra settle time after preview load, per object.")
    parser.add_argument("--width", type=int, default=960)
    parser.add_argument("--height", type=int, default=640)
    parser.add_argument("--view-scale", type=float, default=0.75)
    parser.add_argument("--commit", action="store_true", help="Create a git commit in the Pages repo after rendering.")
    parser.add_argument("--push", action="store_true", help="Push after committing.")
    return parser.parse_args()


def get_json(url: str) -> dict:
    with urllib.request.urlopen(url) as response:
        return json.loads(response.read().decode("utf-8"))


def wait_for_health(deadline: float) -> None:
    while time.time() < deadline:
        try:
            payload = get_json(f"{SERVER_URL}/health")
            if payload.get("ok") is True:
                return
        except Exception:
            pass
        time.sleep(0.25)
    raise RuntimeError("freeworld preview server did not become healthy")


def start_server() -> subprocess.Popen[str]:
    try:
        payload = get_json(f"{SERVER_URL}/health")
        if payload.get("ok") is True:
            return None  # type: ignore[return-value]
    except Exception:
        pass
    env = os.environ.copy()
    env["PYTHONUNBUFFERED"] = "1"
    return subprocess.Popen(
        [
            str(FREEWORLD_PYTHON),
            "-m",
            "uvicorn",
            "app.main:app",
            "--host",
            "127.0.0.1",
            "--port",
            "8012",
        ],
        cwd=str(FREEWORLD_ROOT),
        env=env,
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
        text=True,
    )


def stop_server(proc: subprocess.Popen[str] | None) -> None:
    if proc is None or proc.poll() is not None:
        return
    proc.terminate()
    try:
        proc.wait(timeout=5)
    except subprocess.TimeoutExpired:
        proc.kill()
        proc.wait(timeout=5)


def wait_for_page_ready(page, timeout_ms: int = 20000) -> None:
    page.wait_for_selector("#world", timeout=timeout_ms)
    page.wait_for_selector("#loaded-chunks", state="attached", timeout=timeout_ms)


def configure_world_mode(page, preset: str) -> None:
    page.wait_for_function(
        """
        (preset) => {
          const select = document.getElementById("worldgen-preset");
          if (!select) return false;
          return [...select.options].some((opt) => opt.value === preset);
        }
        """,
        arg=preset,
        timeout=10000,
    )
    page.evaluate(
        """
        ({ preset }) => {
          const select = document.getElementById("worldgen-preset");
          if (!select) return;
          select.value = preset;
          select.dispatchEvent(new Event("change", { bubbles: true }));
        }
        """,
        {"preset": preset},
    )


def apply_view_scale(page, scale: float) -> None:
    page.evaluate(
        """
        (scale) => {
          if (window.__lwCapture && typeof window.__lwCapture.setViewScale === "function") {
            window.__lwCapture.setViewScale(scale);
          }
        }
        """,
        float(scale),
    )


def hide_ui(page) -> None:
    page.evaluate(
        """
        () => {
          const selectors = [".topbar", ".settings-panel", "#settings-toggle", ".viewport-overlay", ".info-panel"];
          for (const sel of selectors) {
            for (const el of document.querySelectorAll(sel)) {
              el.style.display = "none";
            }
          }
        }
        """
    )


def read_chunk_progress(page) -> dict[str, int]:
    payload = page.evaluate(
        """
        () => {
          const txt = (document.getElementById("done-chunks")?.textContent || "").trim();
          const m = txt.match(/(\\d+)\\s*\\/\\s*(\\d+)/);
          const loaded = parseInt((document.getElementById("loaded-chunks")?.textContent || "0").trim(), 10) || 0;
          return {
            done: m ? parseInt(m[1], 10) : 0,
            total: m ? parseInt(m[2], 10) : 0,
            loaded,
          };
        }
        """
    )
    return {
        "done": int(payload.get("done", 0)),
        "total": int(payload.get("total", 0)),
        "loaded": int(payload.get("loaded", 0)),
    }


def wait_for_preview_progress(page, max_wait: float) -> dict[str, int]:
    deadline = time.time() + max(0.1, max_wait)
    latest = {"done": 0, "total": 0, "loaded": 0}
    while time.time() < deadline:
        latest = read_chunk_progress(page)
        if latest["total"] > 0 and latest["done"] >= latest["total"]:
            return latest
        if latest["total"] > 0 and latest["loaded"] >= max(28, int(latest["total"] * 0.06)):
            return latest
        if latest["total"] == 0 and latest["loaded"] >= 20:
            return latest
        page.wait_for_timeout(250)
    return latest


def set_camera(page, *, x: float, y: float, z: float, yaw_deg: float, pitch_deg: float, fov: float = 70.0) -> None:
    page.evaluate(
        """
        (cfg) => {
          if (window.__lwCapture && typeof window.__lwCapture.setCamera === "function") {
            window.__lwCapture.setCamera(cfg);
          }
        }
        """,
        {
            "x": float(x),
            "y": float(y),
            "z": float(z),
            "yawDeg": float(yaw_deg),
            "pitchDeg": float(pitch_deg),
            "fov": float(fov),
        },
    )


def slugify(text: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", text.lower()).strip("-")


def build_view_cameras(object_meta: dict) -> list[dict[str, float | str]]:
    obj = object_meta["object"]
    camera = object_meta["camera"]
    (x0, y0, z0), (x1, y1, z1) = obj["bbox"]
    block_size = 0.05
    center_x = ((x0 + x1) / 2.0) * block_size
    center_y = ((y0 + y1) / 2.0) * block_size
    center_z = ((z0 + z1) / 2.0) * block_size
    radius = max(8.0, math.hypot(float(camera["x"]) - center_x, float(camera["z"]) - center_z))
    base_angle = math.atan2(float(camera["x"]) - center_x, float(camera["z"]) - center_z)
    camera_y = float(camera["y"])
    target_y = center_y + min(6.0, max(2.0, ((y1 - y0 + 1) * block_size) * 0.18))
    views: list[dict[str, float | str]] = []

    for name, offset_deg in zip(VIEW_NAMES, VIEW_ANGLE_OFFSETS_DEG):
        angle = base_angle + math.radians(offset_deg)
        cam_x = center_x + (math.sin(angle) * radius)
        cam_z = center_z + (math.cos(angle) * radius)
        dx = center_x - cam_x
        dy = target_y - camera_y
        dz = center_z - cam_z
        yaw_deg = math.degrees(math.atan2(dx, dz))
        pitch_deg = math.degrees(math.atan2(dy, max(0.001, math.hypot(dx, dz))))
        views.append(
            {
                "name": name,
                "x": round(cam_x, 3),
                "y": round(camera_y, 3),
                "z": round(cam_z, 3),
                "yawDeg": round(yaw_deg, 2),
                "pitchDeg": round(pitch_deg, 2),
            }
        )
    return views


def render_asset_previews(args: argparse.Namespace) -> dict:
    PREVIEW_ROOT.mkdir(parents=True, exist_ok=True)
    objects_payload = get_json(f"{SERVER_URL}/w/{WORLD_NAME}/gen/{PRESET}/objects.json")
    objects = list(objects_payload.get("objects", []))
    if args.limit > 0:
        objects = objects[:args.limit]

    manifest_entries: list[dict] = []

    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(
            headless=True,
            channel="chrome",
            args=["--disable-gpu", "--use-gl=swiftshader", "--no-sandbox", "--disable-dev-shm-usage"],
        )
        context = browser.new_context(viewport={"width": max(320, args.width), "height": max(240, args.height)})
        page = context.new_page()

        for index, item in enumerate(objects, start=1):
            object_id = str(item["id"])
            object_meta = get_json(
                f"{SERVER_URL}/w/{WORLD_NAME}/gen/{PRESET}/object/{urllib.parse.quote(object_id, safe='')}.json"
            )
            url = f"{SERVER_URL}/?focus={urllib.parse.quote(object_id, safe='')}&shot=1"
            page.goto(url, wait_until="domcontentloaded")
            wait_for_page_ready(page)
            configure_world_mode(page, PRESET)
            apply_view_scale(page, args.view_scale)
            progress = wait_for_preview_progress(page, args.max_wait)
            if args.post_wait > 0:
                page.wait_for_timeout(int(args.post_wait * 1000))
            hide_ui(page)
            page.wait_for_timeout(80)

            folder = PREVIEW_ROOT / item["type"]
            folder.mkdir(parents=True, exist_ok=True)
            asset_slug = slugify(object_id)
            views = []
            for view in build_view_cameras(object_meta):
                set_camera(
                    page,
                    x=float(view["x"]),
                    y=float(view["y"]),
                    z=float(view["z"]),
                    yaw_deg=float(view["yawDeg"]),
                    pitch_deg=float(view["pitchDeg"]),
                )
                page.wait_for_timeout(120)
                rel_path = Path("asset-previews") / item["type"] / f"{asset_slug}-{view['name']}.png"
                abs_path = SITE_ROOT / rel_path
                page.locator("#world").screenshot(path=str(abs_path))
                views.append(
                    {
                        "name": view["name"],
                        "image": rel_path.as_posix(),
                        "camera": {
                            "x": view["x"],
                            "y": view["y"],
                            "z": view["z"],
                            "yawDeg": view["yawDeg"],
                            "pitchDeg": view["pitchDeg"],
                        },
                    }
                )

            manifest_entries.append(
                {
                    "id": object_id,
                    "type": item["type"],
                    "label": item["label"],
                    "tags": list(item.get("tags", [])),
                    "progress": progress,
                    "views": views,
                }
            )
            print(f"[{index}/{len(objects)}] rendered {object_id}", flush=True)

        context.close()
        browser.close()

    manifest = {
        "generated_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "world": WORLD_NAME,
        "preset": PRESET,
        "count": len(manifest_entries),
        "items": manifest_entries,
    }
    MANIFEST_PATH.write_text(json.dumps(manifest, indent=2), encoding="utf-8")
    return manifest


def git_commit_and_push(args: argparse.Namespace, manifest: dict) -> None:
    subprocess.run(["git", "-C", str(REPO_ROOT), "add", "freeworld-city"], check=True)
    if args.commit:
        subprocess.run(
            ["git", "-C", str(REPO_ROOT), "commit", "-m", f"Update asset previews ({manifest['count']} assets)"],
            check=True,
        )
    if args.push:
        subprocess.run(["git", "-C", str(REPO_ROOT), "push", "origin", "main"], check=True)


def main() -> int:
    args = parse_args()
    server_proc: subprocess.Popen[str] | None = None
    try:
        server_proc = start_server()
        wait_for_health(time.time() + 25.0)
        manifest = render_asset_previews(args)
        git_commit_and_push(args, manifest)
        print(f"saved manifest: {MANIFEST_PATH}")
        return 0
    finally:
        stop_server(server_proc)


if __name__ == "__main__":
    raise SystemExit(main())
