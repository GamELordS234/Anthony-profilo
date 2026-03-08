# GitHub Push Script for Anthony's Portfolio
# This script automates pushing your code to GitHub

# BEFORE RUNNING THIS SCRIPT:
# 1. Create repository on GitHub: https://github.com/new
#    - Name: anthony-portfolio
#    - Make it Public or Private
#    - Click "Create repository"
# 2. You'll see setup instructions
# 3. Replace YOUR_GITHUB_USERNAME below with GamELordS234

param(
    [string]$GitHubUsername = "GamELordS234"
)

Write-Host "════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "  GitHub Push Script - Anthony's Portfolio" -ForegroundColor Green
Write-Host "════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

# Check if Git is installed
if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Git is not installed!" -ForegroundColor Red
    Write-Host "Download from: https://git-scm.com/download/win" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Git is installed" -ForegroundColor Green
Write-Host ""

# Change to portfolio directory
$portfolioPath = "c:\Users\HP\Desktop\anthony web\Alex Portfolio"
cd $portfolioPath
Write-Host "📁 Working directory: $portfolioPath" -ForegroundColor Yellow
Write-Host ""

# Configure git user
Write-Host "🔧 Configuring Git..." -ForegroundColor Cyan
git config --global user.name "Anthony" | Out-Null
git config --global user.email "anthony@example.com" | Out-Null
Write-Host "✅ Git configured" -ForegroundColor Green
Write-Host ""

# Set up remote
Write-Host "🔗 Connecting to GitHub..." -ForegroundColor Cyan
$repoUrl = "https://github.com/$GitHubUsername/anthony-portfolio.git"
Write-Host "Repository: $repoUrl" -ForegroundColor Yellow

# Check if remote already exists
$currentRemote = git remote get-url origin 2>$null
if ($null -eq $currentRemote) {
    git remote add origin $repoUrl
    Write-Host "✅ Remote added" -ForegroundColor Green
} else {
    Write-Host "⚠️  Remote already configured: $currentRemote" -ForegroundColor Yellow
}
Write-Host ""

# Set main branch
Write-Host "📌 Setting main branch..." -ForegroundColor Cyan
git branch -M main 2>$null
Write-Host "✅ Branch renamed to 'main'" -ForegroundColor Green
Write-Host ""

# Push code
Write-Host "📤 Pushing code to GitHub..." -ForegroundColor Cyan
Write-Host "⚠️  GitHub will prompt you to login in your browser" -ForegroundColor Yellow
Write-Host "   Keep this terminal open while you authenticate" -ForegroundColor Yellow
Write-Host ""

git push -u origin main

Write-Host ""
Write-Host "════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "✅ CODE PUSHED SUCCESSFULLY!" -ForegroundColor Green
Write-Host "════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Visit: https://github.com/$GitHubUsername/anthony-portfolio" -ForegroundColor White
Write-Host "2. Verify code is there" -ForegroundColor White
Write-Host "3. Go to DEPLOY_NOW.md for Netlify deployment" -ForegroundColor White
Write-Host ""
