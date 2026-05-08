@echo off
REM StudyBridge Auto Startup Batch Script for Windows
REM Starts backend and frontend automatically

setlocal enabledelayedexpansion

echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║           StudyBridge - Auto Startup                       ║
echo ║                                                            ║
echo ║  Starting backend on port 5000                             ║
echo ║  Starting frontend on port 5173+                           ║
echo ║  Opening app in browser automatically                      ║
echo ╚════════════════════════════════════════════════════════════╝
echo.

REM Kill existing Node processes
echo 🔄 Cleaning up old processes...
taskkill /IM node.exe /F >nul 2>&1
timeout /t 1 /nobreak >nul

REM Start Backend
echo.
echo 📦 Starting Backend (port 5000)...
start "StudyBridge Backend" cmd /k "cd backend && npm run dev"
timeout /t 3 /nobreak >nul

REM Start Frontend
echo.
echo 🎨 Starting Frontend (port 5174)...
start "StudyBridge Frontend" cmd /k "cd frontend && npm run dev"
timeout /t 3 /nobreak >nul

REM Open in browser
echo.
echo 🌐 Opening app in browser...
timeout /t 2 /nobreak >nul
start http://localhost:5174

echo.
echo ✨ StudyBridge is ready!
echo    Frontend: http://localhost:5173 (or 5174, 5175 if port in use)
echo    Backend:  http://localhost:5000
echo    
echo    Check the terminal windows for logs
echo    Press Ctrl+C in any terminal to stop services
echo    The browser will open automatically above
echo.
pause
