@echo off
REM StudyBridge: install deps and start dev servers (Windows CMD)
echo Installing root, backend, and frontend dependencies...
npm run install-all
if %errorlevel% neq 0 (
  echo Dependency installation failed. Check error messages above.
  pause
  exit /b %errorlevel%
)
echo Starting development servers (concurrently)...
npm run dev
pause
