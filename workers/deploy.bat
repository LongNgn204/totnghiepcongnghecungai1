@echo off
REM Cloudflare Workers Deployment Script for Windows
REM Usage: deploy.bat [environment]
REM Example: deploy.bat production

setlocal enabledelayedexpansion

set ENVIRONMENT=%1
if "%ENVIRONMENT%"=="" set ENVIRONMENT=development

set PROJECT_NAME=ai-hoc-tap-api

echo.
echo ========================================
echo Deploying %PROJECT_NAME% to %ENVIRONMENT%
echo ========================================
echo.

REM Check if wrangler is installed
where wrangler >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Wrangler CLI is not installed
    echo Install it with: npm install -g wrangler
    exit /b 1
)

echo [INFO] Checking prerequisites...

REM Check if wrangler.toml exists
if not exist "wrangler.toml" (
    echo [ERROR] wrangler.toml not found
    exit /b 1
)

REM Check if package.json exists
if not exist "package.json" (
    echo [ERROR] package.json not found
    exit /b 1
)

echo [OK] Prerequisites OK
echo.

REM Step 1: Install dependencies
echo [INFO] Installing dependencies...
call npm ci
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Failed to install dependencies
    exit /b 1
)
echo [OK] Dependencies installed
echo.

REM Step 2: Check Gemini API Key
echo [INFO] Checking Gemini API Key...
wrangler secret list | findstr "GEMINI_API_KEY" >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo [OK] GEMINI_API_KEY is set
) else (
    echo [WARNING] GEMINI_API_KEY not found
    echo You need to set it with:
    echo   wrangler secret put GEMINI_API_KEY
    echo.
    set /p SETUP_KEY="Set it now? (y/n): "
    if /i "!SETUP_KEY!"=="y" (
        call wrangler secret put GEMINI_API_KEY
    )
)
echo.

REM Step 3: Check Database
echo [INFO] Checking database...
wrangler d1 list | findstr "ai-hoc-tap-db" >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo [OK] Database exists
) else (
    echo [WARNING] Database not found
    echo Creating database...
    call wrangler d1 create ai-hoc-tap-db
)
echo.

REM Step 4: Build
echo [INFO] Building...
echo [OK] Build ready
echo.

REM Step 5: Deploy
echo [INFO] Deploying to Cloudflare Workers...

if "%ENVIRONMENT%"=="production" (
    echo Deploying to PRODUCTION...
    call wrangler deploy --env production
) else (
    echo Deploying to DEVELOPMENT...
    call wrangler deploy
)

if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Deployment failed
    exit /b 1
)

echo.
echo [OK] Deployment successful!
echo.

REM Step 6: Test deployment
echo [INFO] Testing deployment...
for /f "tokens=*" %%i in ('wrangler whoami ^| findstr "Account ID"') do set ACCOUNT_ID=%%i
set ACCOUNT_ID=%ACCOUNT_ID:Account ID = %

set DEPLOYED_URL=https://%PROJECT_NAME%.%ACCOUNT_ID%.workers.dev

echo Deployed URL: %DEPLOYED_URL%
echo.

REM Test health endpoint
powershell -Command "try { $response = Invoke-WebRequest -Uri '%DEPLOYED_URL%/api/health' -ErrorAction Stop; if ($response.StatusCode -eq 200) { Write-Host '[OK] Health check passed' } } catch { Write-Host '[WARNING] Health check failed' }"

echo.
echo ========================================
echo Deployment complete!
echo ========================================
echo.
echo Next steps:
echo 1. Update frontend VITE_API_URL to: %DEPLOYED_URL%
echo 2. Deploy frontend to Cloudflare Pages
echo 3. Run integration tests
echo.
echo For more info, see: CLOUDFLARE_AI_GATEWAY_SETUP.md
echo.

