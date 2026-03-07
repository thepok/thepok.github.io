#!/home/Marcel/dev/browser/.venv/bin/python
from __future__ import annotations

import argparse
import json
from pathlib import Path
import subprocess
import time

from playwright.sync_api import sync_playwright

REPO_ROOT = Path("/home/Marcel/dev/githupio")
SITE_ROOT = REPO_ROOT / "freeworld-city"
LIBRARY_PATH = SITE_ROOT / "asset-library.json"
PREVIEW_ROOT = SITE_ROOT / "asset-previews"
MANIFEST_PATH = PREVIEW_ROOT / "manifest.json"
SERVER_PORT = 8024
SERVER_URL = f"http://127.0.0.1:{SERVER_PORT}/freeworld-city"
VIEW_NAMES = ("hero", "corner", "reverse")


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Render isolated static asset previews into the Pages repo.")
    parser.add_argument("--limit", type=int, default=0, help="Only render the first N assets from the library.")
    parser.add_argument("--width", type=int, default=1180)
    parser.add_argument("--height", type=int, default=760)
    parser.add_argument("--post-wait", type=float, default=0.12)
    parser.add_argument("--commit", action="store_true")
    parser.add_argument("--push", action="store_true")
    return parser.parse_args()


def load_library() -> list[dict]:
    payload = json.loads(LIBRARY_PATH.read_text(encoding="utf-8"))
    assets = list(payload.get("assets", []))
    if not assets:
      raise RuntimeError("asset library is empty")
    return assets


def start_server() -> subprocess.Popen[str]:
    return subprocess.Popen(
        ["python3", "-m", "http.server", str(SERVER_PORT)],
        cwd=str(REPO_ROOT),
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


def wait_for_server(deadline: float) -> None:
    import urllib.request

    while time.time() < deadline:
        try:
            with urllib.request.urlopen(f"{SERVER_URL}/asset-library.json") as response:
                if response.status == 200:
                    return
        except Exception:
            pass
        time.sleep(0.2)
    raise RuntimeError("static preview server did not become ready")


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
    assets = load_library()
    if args.limit > 0:
        assets = assets[:args.limit]

    manifest_items: list[dict] = []
    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(
            headless=True,
            channel="chrome",
            args=["--disable-gpu", "--use-gl=swiftshader", "--no-sandbox", "--disable-dev-shm-usage"],
        )
        context = browser.new_context(viewport={"width": max(320, args.width), "height": max(240, args.height)})
        page = context.new_page()
        page.goto(f"{SERVER_URL}/asset-scene.html?shot=1", wait_until="domcontentloaded")
        page.wait_for_selector("#preview-canvas", timeout=20000)

        for index, asset in enumerate(assets, start=1):
            page.evaluate(
                """
                (assetId) => {
                  window.__assetPreviewCapture.setAsset(assetId);
                  return window.__assetPreviewCapture.getState();
                }
                """,
                asset["id"],
            )
            page.wait_for_function(
                """
                (assetId) => {
                  const state = window.__assetPreviewCapture?.getState?.();
                  return Boolean(state && state.ready && state.asset === assetId);
                }
                """,
                arg=asset["id"],
                timeout=10000,
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
                      return Boolean(state && state.ready && state.asset === payload.assetId && state.view === payload.viewName);
                    }
                    """,
                    arg={"assetId": asset["id"], "viewName": view_name},
                    timeout=5000,
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
    server_proc = None
    try:
        reset_preview_dir()
        server_proc = start_server()
        wait_for_server(time.time() + 20.0)
        manifest = render_assets(args)
        git_commit_and_push(args, manifest)
        print(f"saved manifest: {MANIFEST_PATH}")
        return 0
    finally:
        stop_server(server_proc)


if __name__ == "__main__":
    raise SystemExit(main())
