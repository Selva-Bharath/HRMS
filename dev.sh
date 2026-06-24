#!/usr/bin/env bash
# dev.sh — run frontend and backend locally (no Docker required)
# Requires: Python 3.11+, Node 20+, PostgreSQL running locally
set -e

# ── Backend ─────────────────────────────────────────────────────────────────
echo "[*] Setting up backend..."
cd backend

if [ ! -d venv ]; then
  python -m venv venv
  echo "    Virtual environment created."
fi

# Activate venv (bash/zsh). On Windows Git Bash this path works.
# PowerShell users: run  venv\Scripts\Activate.ps1  manually.
source venv/Scripts/activate 2>/dev/null || source venv/bin/activate

pip install -r requirements.txt -q

export FLASK_APP=app.py
export FLASK_ENV=development

echo "[*] Applying database migrations..."
flask db upgrade

echo "[*] Starting Flask backend on :5000..."
python app.py &
BACKEND_PID=$!

cd ..

# ── Frontend ─────────────────────────────────────────────────────────────────
echo "[*] Setting up frontend..."
cd frontend

npm install -q

echo "[*] Starting Vite dev server on :5173..."
npm run dev &
FRONTEND_PID=$!

cd ..

echo ""
echo "[✓] Dev servers started:"
echo "    Backend  : http://localhost:5050"
echo "    Frontend : http://localhost:5173"
echo ""
echo "Press Ctrl+C to stop both servers."

cleanup() {
  echo ""
  echo "[*] Shutting down..."
  kill "$BACKEND_PID" "$FRONTEND_PID" 2>/dev/null || true
}
trap cleanup INT TERM
wait
