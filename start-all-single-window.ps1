#!/usr/bin/env pwsh
# StudyBridge Complete Startup Script
# Starts backend and frontend in a single organized window with tabs

Write-Host "
╔════════════════════════════════════════════════════════════╗
║           StudyBridge - Auto Startup Script               ║
║                                                            ║
║  Starting backend on port 5000                             ║
║  Starting frontend on port 5174                            ║
║  Opening app at http://localhost:5174                      ║
╚════════════════════════════════════════════════════════════╝
" -ForegroundColor Cyan

$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path

# Kill any existing Node processes
Write-Host "🔄 Cleaning up old processes..." -ForegroundColor Yellow
taskkill /IM node.exe /F 2>$null | Out-Null
Start-Sleep -Milliseconds 500

# Start Backend
Write-Host "`n📦 Starting Backend (port 5000)..." -ForegroundColor Green
$backendProcess = Start-Process powershell -ArgumentList "-NoExit -Command `"cd '$projectRoot\backend' && npm run dev`"" -PassThru
Write-Host "   ✅ Backend process started (PID: $($backendProcess.Id))" -ForegroundColor Green

Start-Sleep -Seconds 3

# Start Frontend
Write-Host "`n🎨 Starting Frontend (port 5174)..." -ForegroundColor Green
$frontendProcess = Start-Process powershell -ArgumentList "-NoExit -Command `"cd '$projectRoot\frontend' && npm run dev`"" -PassThru
Write-Host "   ✅ Frontend process started (PID: $($frontendProcess.Id))" -ForegroundColor Green

Start-Sleep -Seconds 3

# Open in browser
Write-Host "`n🌐 Opening app in browser..." -ForegroundColor Cyan
Start-Sleep -Seconds 2
Start-Process "http://localhost:5174"

Write-Host "`n✨ StudyBridge is ready!
   Frontend: http://localhost:5174
   Backend:  http://localhost:5000
   
   Press Ctrl+C in either window to stop services
" -ForegroundColor Cyan

# Keep script running and monitor processes
while ($true) {
    if ($backendProcess.HasExited) {
        Write-Host "⚠️  Backend process exited!" -ForegroundColor Red
    }
    if ($frontendProcess.HasExited) {
        Write-Host "⚠️  Frontend process exited!" -ForegroundColor Red
    }
    Start-Sleep -Seconds 5
}
