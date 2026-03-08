#!/home/Marcel/dev/browser/.venv/bin/python
from __future__ import annotations

import argparse
import json
import math
from pathlib import Path
import subprocess
import time
import urllib.parse
import urllib.request

from playwright.sync_api import sync_playwright

REPO_ROOT = Path("/home/Marcel/dev/githupio")
SITE_ROOT = REPO_ROOT / "freeworld-city"
FREEWORLD_ROOT = Path("/home/Marcel/dev/freeworld")
LIBRARY_PATH = SITE_ROOT / "asset-library.json"
PREVIEW_ROOT = SITE_ROOT / "asset-previews"
MANIFEST_PATH = PREVIEW_ROOT / "manifest.json"
STATIC_SERVER_PORT = 8024
STATIC_SERVER_URL = f"http://127.0.0.1:{STATIC_SERVER_PORT}/freeworld-city"
CITY_SERVER_URL = "http://127.0.0.1:8012"
WORLD_NAME = "leonardos-world"
PRESET_NAME = "city"
CHUNK_SIZE = 32
VIEW_NAMES = ("hero", "corner", "reverse")


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Render isolated previews of real generated city elements into the Pages repo.")
    parser.add_argument("--limit", type=int, default=0, help="Only render the first N assets from the library.")
    parser.add_argument("--width", type=int, default=1180)
    parser.add_argument("--height", type=int, default=760)
    parser.add_argument("--post-wait", type=float, default=0.12)
    parser.add_argument("--commit", action="store_true")
    parser.add_argument("--push", action="store_true")
    return parser.parse_args()


def fetch_json(url: str) -> dict:
    with urllib.request.urlopen(url, timeout=20) as response:
        return json.load(response)


def load_city_block_size() -> float:
    payload = json.loads((SITE_ROOT / "presets.json").read_text(encoding="utf-8"))
    for entry in payload.get("presets", []):
        if entry.get("name") == PRESET_NAME:
            return max(0.01, float(entry.get("block_size_m") or 0.25))
    return 0.25


def slugify(value: str) -> str:
    out = []
    for char in value:
        if char.isalnum():
            out.append(char.lower())
        elif char == "-":
            out.append("neg")
        else:
            out.append("_")
    slug = "".join(out).strip("_")
    while "__" in slug:
        slug = slug.replace("__", "_")
    return slug or "asset"


def compute_view(center: tuple[float, float, float], target_y: float, radius: float, azimuth_deg: float, elevation_deg: float) -> dict:
    azimuth = math.radians(azimuth_deg)
    elevation = math.radians(elevation_deg)
    cam_x = center[0] + (math.sin(azimuth) * math.cos(elevation) * radius)
    cam_y = center[1] + (math.sin(elevation) * radius)
    cam_z = center[2] + (math.cos(azimuth) * math.cos(elevation) * radius)
    return {
        "camera": {"x": round(cam_x, 3), "y": round(cam_y, 3), "z": round(cam_z, 3)},
        "target": {"x": round(center[0], 3), "y": round(target_y, 3), "z": round(center[2], 3)},
    }


def compute_azimuth_deg(camera_x: float, camera_z: float, center_x: float, center_z: float) -> float:
    return math.degrees(math.atan2(camera_x - center_x, camera_z - center_z))


def object_chunk_bounds(bbox: list[list[int]], margin_xz: int = 0, margin_y: int = 0, max_vertical_chunks: int = 6) -> dict:
    (x0, y0, z0), (x1, y1, z1) = bbox
    min_cy = math.floor(y0 / CHUNK_SIZE) - margin_y
    max_cy = math.floor(y1 / CHUNK_SIZE) + margin_y
    if max_vertical_chunks > 0:
        max_cy = min(max_cy, min_cy + max_vertical_chunks - 1)
    return {
        "min": [
            math.floor(x0 / CHUNK_SIZE) - margin_xz,
            min_cy,
            math.floor(z0 / CHUNK_SIZE) - margin_xz,
        ],
        "max": [
            math.floor(x1 / CHUNK_SIZE) + margin_xz,
            max_cy,
            math.floor(z1 / CHUNK_SIZE) + margin_xz,
        ],
    }


def build_library(limit: int = 0) -> list[dict]:
    object_list = fetch_json(f"{CITY_SERVER_URL}/w/{WORLD_NAME}/gen/{PRESET_NAME}/objects.json")
    objects = list(object_list.get("objects", []))
    if limit > 0:
        objects = objects[:limit]

    block_size = load_city_block_size()
    assets: list[dict] = []
    for item in objects:
        object_id = item["id"]
        encoded = urllib.parse.quote(object_id, safe="")
        meta = fetch_json(f"{CITY_SERVER_URL}/w/{WORLD_NAME}/gen/{PRESET_NAME}/object/{encoded}.json")
        bbox = meta["object"]["bbox"]
        chunk_bounds = object_chunk_bounds(bbox)
        (x0, y0, z0), (x1, y1, z1) = bbox
        center_x = ((x0 + x1) / 2.0) * block_size
        center_z = ((z0 + z1) / 2.0) * block_size
        span_x = (x1 - x0 + 1) * block_size
        span_y = (y1 - y0 + 1) * block_size
        span_z = (z1 - z0 + 1) * block_size
        crop_min_y = chunk_bounds["min"][1] * CHUNK_SIZE * block_size
        crop_max_y = (chunk_bounds["max"][1] + 1) * CHUNK_SIZE * block_size
        crop_span_y = max(block_size, crop_max_y - crop_min_y)
        target_y = crop_min_y + max(1.6, min(4.0, crop_span_y * 0.18))
        hero_azimuth = compute_azimuth_deg(meta["camera"]["x"], meta["camera"]["z"], center_x, center_z)
        hero_radius = max(10.0, max(span_x, span_z) * 1.02)
        views = {
            "hero": compute_view((center_x, target_y, center_z), target_y, hero_radius, hero_azimuth, 6.0),
            "corner": compute_view((center_x, target_y, center_z), target_y, hero_radius * 0.96, hero_azimuth + 74.0, 12.0),
            "reverse": compute_view((center_x, target_y, center_z), target_y, hero_radius * 1.06, hero_azimuth + 180.0, 8.0),
        }

        primary_type = item["type"]
        for tag in item.get("tags", []):
            if tag in {"office_tower", "mixed_use_midrise", "apartment_midrise", "shop_row", "warehouse", "townhouse_row", "office_midrise"}:
                primary_type = tag
                break
        asset_id = slugify(object_id)
        assets.append(
            {
                "id": asset_id,
                "label": item.get("label") or object_id,
                "type": primary_type,
                "source_object_id": object_id,
                "preset": PRESET_NAME,
                "tags": list(item.get("tags", [])),
                "description": f"Real generated {primary_type} specimen from the city world.",
                "bbox": bbox,
                "chunkBounds": chunk_bounds,
                "baseAzimuthDeg": round(hero_azimuth, 2),
                "views": views,
            }
        )

    payload = {
        "generated_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "world": WORLD_NAME,
        "preset": PRESET_NAME,
        "count": len(assets),
        "assets": assets,
    }
    LIBRARY_PATH.write_text(json.dumps(payload, indent=2), encoding="utf-8")
    return assets


def start_static_server() -> subprocess.Popen[str]:
    return subprocess.Popen(
        ["python3", "-m", "http.server", str(STATIC_SERVER_PORT)],
        cwd=str(REPO_ROOT),
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
        text=True,
    )


def start_city_server() -> subprocess.Popen[str]:
    return subprocess.Popen(
        [str(FREEWORLD_ROOT / ".venv/bin/uvicorn"), "app.main:app", "--host", "127.0.0.1", "--port", "8012"],
        cwd=str(FREEWORLD_ROOT),
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


def wait_for_static_server(deadline: float) -> None:
    while time.time() < deadline:
        try:
            with urllib.request.urlopen(f"{STATIC_SERVER_URL}/index.html") as response:
                if response.status == 200:
                    return
        except Exception:
            pass
        time.sleep(0.2)
    raise RuntimeError("static preview server did not become ready")


def wait_for_city_server(deadline: float) -> None:
    while time.time() < deadline:
        try:
            with urllib.request.urlopen(f"{CITY_SERVER_URL}/health") as response:
                if response.status == 200:
                    return
        except Exception:
            pass
        time.sleep(0.2)
    raise RuntimeError("city server did not become ready")


def reset_preview_dir() -> None:
    if PREVIEW_ROOT.exists():
        for path in sorted(PREVIEW_ROOT.rglob("*"), reverse=True):
            if path.is_file():
                path.unlink()
            elif path.is_dir():
                try:
                    path.rmdir()
                except OSError:
                    pass
    PREVIEW_ROOT.mkdir(parents=True, exist_ok=True)


def render_assets(args: argparse.Namespace) -> dict:
    assets = build_library(limit=args.limit)
    if not assets:
        raise RuntimeError("asset library is empty")

    manifest_items: list[dict] = []
    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(
            headless=True,
            channel="chrome",
            args=["--disable-gpu", "--use-gl=swiftshader", "--no-sandbox", "--disable-dev-shm-usage"],
        )
        context = browser.new_context(viewport={"width": max(320, args.width), "height": max(240, args.height)})
        page = context.new_page()
        page.goto(f"{STATIC_SERVER_URL}/asset-scene.html?shot=1", wait_until="domcontentloaded")
        page.wait_for_selector("#preview-canvas", timeout=20000)

        for index, asset in enumerate(assets, start=1):
            page.evaluate("""(assetId) => window.__assetPreviewCapture.setAsset(assetId)""", asset["id"])
            page.wait_for_function(
                """
                (assetId) => {
                  const state = window.__assetPreviewCapture?.getState?.();
                  return Boolean(state && state.complete && state.asset === assetId);
                }
                """,
                arg=asset["id"],
                timeout=60000,
            )

            folder = PREVIEW_ROOT / asset["type"]
            folder.mkdir(parents=True, exist_ok=True)
            views = []
            for view_name in VIEW_NAMES:
                page.evaluate(
                    """
                    (viewName) => {
                      window.__assetPreviewCapture.setView(viewName);
                      return window.__assetPreviewCapture.getState();
                    }
                    """,
                    view_name,
                )
                page.wait_for_function(
                    """
                    (payload) => {
                      const state = window.__assetPreviewCapture?.getState?.();
                      return Boolean(state && state.complete && state.asset === payload.assetId && state.view === payload.viewName);
                    }
                    """,
                    arg={"assetId": asset["id"], "viewName": view_name},
                    timeout=20000,
                )
                if args.post_wait > 0:
                    page.wait_for_timeout(int(args.post_wait * 1000))
                rel_path = Path("asset-previews") / asset["type"] / f"{asset['id']}-{view_name}.png"
                abs_path = SITE_ROOT / rel_path
                page.locator("#preview-canvas").screenshot(path=str(abs_path))
                views.append({"name": view_name, "image": rel_path.as_posix()})

            manifest_items.append(
                {
                    "id": asset["id"],
                    "label": asset["label"],
                    "type": asset["type"],
                    "source_object_id": asset["source_object_id"],
                    "tags": list(asset.get("tags", [])),
                    "description": asset.get("description", ""),
                    "views": views,
                }
            )
            print(f"[{index}/{len(assets)}] rendered {asset['id']}", flush=True)

        context.close()
        browser.close()

    manifest = {
        "generated_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "count": len(manifest_items),
        "items": manifest_items,
    }
    MANIFEST_PATH.write_text(json.dumps(manifest, indent=2), encoding="utf-8")
    return manifest


def git_commit_and_push(args: argparse.Namespace, manifest: dict) -> None:
    subprocess.run(["git", "-C", str(REPO_ROOT), "add", "freeworld-city"], check=True)
    if args.commit:
        subprocess.run(
            ["git", "-C", str(REPO_ROOT), "commit", "-m", f"Update isolated asset previews ({manifest['count']} assets)"],
            check=True,
        )
    if args.push:
        subprocess.run(["git", "-C", str(REPO_ROOT), "push", "origin", "main"], check=True)


def main() -> int:
    args = parse_args()
    static_server_proc = None
    city_server_proc = None
    try:
        reset_preview_dir()
        try:
            wait_for_city_server(time.time() + 2.0)
        except Exception:
            city_server_proc = start_city_server()
            wait_for_city_server(time.time() + 20.0)
        static_server_proc = start_static_server()
        wait_for_static_server(time.time() + 20.0)
        manifest = render_assets(args)
        git_commit_and_push(args, manifest)
        print(f"saved manifest: {MANIFEST_PATH}")
        return 0
    finally:
        stop_server(static_server_proc)
        stop_server(city_server_proc)


if __name__ == "__main__":
    raise SystemExit(main())
