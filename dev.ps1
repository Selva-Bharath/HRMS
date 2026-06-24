# dev.ps1 - Run frontend and backend locally (Windows PowerShell, no Docker)
# Requires: Python 3.11+, Node 20+, PostgreSQL running locally

# Backend
Write-Host "[*] Setting up backend..."
Set-Location backend

if (-not (Test-Path "venv")) {
    python -m venv venv
    Write-Host "    Virtual environment created."
}

& "venv\Scripts\Activate.ps1"

pip install -r requirements.txt -q

$env:FLASK_APP = "app.py"
$env:FLASK_ENV = "development"

Write-Host "[*] Applying database migrations..."
flask db upgrade

Write-Host "[*] Starting Flask backend on :5050..."
$backendDir = $PWD.Path
$backendJob = Start-Job -ScriptBlock {
    Set-Location $using:backendDir
    & "venv\Scripts\python.exe" app.py
}

Set-Location ..

# Frontend
Write-Host "[*] Setting up frontend..."
Set-Location frontend

npm install -q

Write-Host "[*] Starting Vite dev server on :5173..."
$frontendDir = $PWD.Path
$frontendJob = Start-Job -ScriptBlock {
    Set-Location $using:frontendDir
    npm run dev
}

Set-Location ..

Write-Host ""
Write-Host "[OK] Dev servers started:"
Write-Host "    Backend  : http://localhost:5050"
Write-Host "    Frontend : http://localhost:5173"
Write-Host ""
Write-Host "Press Ctrl+C or close this window to stop."

try {
    Wait-Job $backendJob, $frontendJob
} finally {
    Stop-Job $backendJob, $frontendJob -ErrorAction SilentlyContinue
    Remove-Job $backendJob, $frontendJob -ErrorAction SilentlyContinue
}
