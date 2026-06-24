# run.ps1 - Build and start HRMS with Docker Compose (Windows PowerShell)

# 1. Ensure .env exists
if (-not (Test-Path ".env")) {
    Copy-Item ".env.example" ".env"
    Write-Host ""
    Write-Host "[!] .env file created from .env.example."
    Write-Host "    Edit .env with your real values, then re-run this script."
    Write-Host ""
    exit 1
}

# 2. Build and start containers
Write-Host "[*] Building and starting services (postgres + app)..."
docker compose up --build -d
if ($LASTEXITCODE -ne 0) {
    Write-Host "[ERROR] docker compose failed. Is Docker Desktop running?"
    exit 1
}

Write-Host "[*] Waiting for services to be ready..."
Start-Sleep -Seconds 12

# 3. Run database migrations
# Check if migrations directory exists inside the container
docker compose exec app test -d migrations 2>&1 | Out-Null
if ($LASTEXITCODE -ne 0) {
    Write-Host "[*] First run - initialising Alembic migrations..."
    docker compose exec app flask db init
    docker compose exec app flask db migrate -m "initial schema"
}

Write-Host "[*] Applying database migrations..."
docker compose exec app flask db upgrade

# 4. Seed initial data (skips rows that already exist)
Write-Host "[*] Seeding initial data..."
docker compose exec app python seed.py

# 5. Done
Write-Host ""
Write-Host "[OK] HRMS is running:"
Write-Host "    App      : http://localhost:5050"
Write-Host "    API      : http://localhost:5050/api/health"
Write-Host "    Database : localhost:5432  (db: wms_db)"
Write-Host ""
Write-Host "Useful commands:"
Write-Host "    View logs : docker compose logs -f app"
Write-Host "    Stop      : .\stop.ps1"
Write-Host "    Shell     : docker compose exec app bash"
