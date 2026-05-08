Write-Host "StudyBridge: ensure PowerShell execution policy and start dev servers"
try {
  Write-Host "Setting execution policy for CurrentUser to RemoteSigned..."
  Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned -Force
} catch {
  Write-Warning "Could not set execution policy automatically. Run PowerShell as Administrator or set CurrentUser policy manually."
}

Write-Host "Installing dependencies (root, backend, frontend)..."
npm run install-all
if ($LASTEXITCODE -ne 0) {
  Write-Error "Dependency installation failed. Check output above."
  exit $LASTEXITCODE
}

Write-Host "Starting development servers (concurrently)..."
npm run dev
