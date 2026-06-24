#!/usr/bin/env bash
# run.sh — build and start HRMS with Docker Compose
set -e

if [ ! -f .env ]; then
  cp .env.example .env
  echo ""
  echo "[!] .env file created from .env.example."
  echo "    Edit .env with your real values, then re-run this script."
  echo ""
  exit 1
fi

echo "[*] Building and starting services (postgres + app)..."
docker compose up --build -d

echo "[*] Waiting for app to be ready..."
sleep 8

echo "[*] Running database migrations..."
docker compose exec app flask db upgrade

echo ""
echo "[✓] HRMS is running:"
echo "    App      : http://localhost:5050"
echo "    API      : http://localhost:5050/api/health"
echo "    Database : localhost:5432  (db: wms_db)"
echo ""
echo "To view logs : docker compose logs -f app"
echo "To stop      : bash stop.sh"
