@echo off
echo Setting up AI Terminal environment for Windows...

where node >nul 2>nul
if %errorlevel% neq 0 (
    echo Node.js is not installed. Please install it from https://nodejs.org/
    pause
    exit /b 1
)

echo Installing project dependencies...
call npm install
if %errorlevel% neq 0 (
    echo npm install failed.
    pause
    exit /b %errorlevel%
)

echo Setup complete! You can now run 'npm start' to launch the terminal.
pause
