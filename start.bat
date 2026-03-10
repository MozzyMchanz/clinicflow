@echo off
echo ========================================
echo   ClinicFlow - Starting Server
echo ========================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed!
    echo Please install Node.js from https://nodejs.org
    echo.
    pause
    exit /b 1
)

REM Install dependencies if node_modules doesn't exist
if not exist "node_modules" (
    echo Installing dependencies...
    call npm install
    echo.
)

REM Start the server
echo Starting ClinicFlow server...
echo.
echo Open your browser and go to: http://localhost:3000
echo.
echo Demo Login:
echo   Email:    admin@clinic.com
echo   Password: admin123
echo.
echo Press Ctrl+C to stop the server
echo ========================================

node server.js
