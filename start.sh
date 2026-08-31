#!/usr/bin/env bash
# One-command launcher: backend deps + web export (if missing) + unified server on :8081
set -e
cd "$(dirname "$0")"

echo "→ Python deps"
pip install -q -r backend/requirements.txt

if [ ! -f frontend/dist/index.html ]; then
  echo "→ Building web frontend (first run)"
  (cd frontend && npm install --no-audit --no-fund && npx expo export --platform web)
fi

echo "→ Starting unified server on http://localhost:8081"
exec python3 server.py --port 8081
