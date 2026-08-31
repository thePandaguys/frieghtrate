"""Single-origin launcher: serves the exported Expo web app AND the /api backend.

Usage:  python server.py [--port 8081]
The frontend calls relative `/api/...`, so no CORS or host juggling is needed.
"""
from __future__ import annotations

import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent
sys.path.insert(0, str(ROOT / "backend"))

from fastapi import FastAPI, HTTPException  # noqa: E402
from fastapi.responses import FileResponse  # noqa: E402
from fastapi.staticfiles import StaticFiles  # noqa: E402

from backend.app.main import app as api_app  # noqa: E402

DIST = ROOT / "frontend" / "dist"

server = FastAPI(title="FREYNA — unified app server", docs_url="/api-docs", openapi_url="/openapi.json")
# Backend routes all begin with /api — register them directly (a mount would strip the prefix).
for _route in api_app.router.routes:
    server.router.routes.append(_route)


@server.get("/{full_path:path}")
def spa(full_path: str):
    """Serve the exported SPA; unknown routes fall back to index.html (client routing)."""
    if full_path.startswith("api/"):
        raise HTTPException(status_code=404, detail="Unknown API route")
    candidate = DIST / full_path
    if full_path and candidate.is_file():
        return FileResponse(candidate)
    index = DIST / "index.html"
    if not index.exists():
        raise HTTPException(status_code=503, detail="Frontend not built yet — run: cd frontend && npx expo export --platform web")
    return FileResponse(index)


if __name__ == "__main__":
    import uvicorn
    port = int(sys.argv[sys.argv.index("--port") + 1]) if "--port" in sys.argv else 8081
    uvicorn.run(server, host="0.0.0.0", port=port)
