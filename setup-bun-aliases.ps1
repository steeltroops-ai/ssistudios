# PowerShell script to set up Bun aliases for npm/yarn commands
# Run this script to redirect all package manager commands to Bun

Write-Host "Setting up Bun aliases for package manager commands..." -ForegroundColor Green

# Create npm.bat in the project directory
@"
@echo off
echo Redirecting npm command to Bun...
bun %*
"@ | Out-File -FilePath "npm.bat" -Encoding ASCII

# Create yarn.bat in the project directory  
@"
@echo off
echo Redirecting yarn command to Bun...
bun %*
"@ | Out-File -FilePath "yarn.bat" -Encoding ASCII

# Create pnpm.bat in the project directory
@"
@echo off
echo Redirecting pnpm command to Bun...
bun %*
"@ | Out-File -FilePath "pnpm.bat" -Encoding ASCII

Write-Host "✅ Bun aliases created successfully!" -ForegroundColor Green
Write-Host "Now all npm, yarn, and pnpm commands in this project will use Bun." -ForegroundColor Yellow

# Add to PATH for this session
$env:PATH = "$PWD;$env:PATH"

Write-Host "✅ Aliases active for current session!" -ForegroundColor Green
Write-Host "To make permanent, add this project directory to your system PATH." -ForegroundColor Yellow
