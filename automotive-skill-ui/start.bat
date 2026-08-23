@echo off
setlocal
cd /d "%~dp0"

set "BUNDLED_NODE=%USERPROFILE%\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe"
set "SKILL_FILE=%USERPROFILE%\.codex\skills\automotive-marketing-materials\SKILL.md"

where node >nul 2>nul
if %errorlevel%==0 (
  set "NODE_CMD=node"
) else if exist "%BUNDLED_NODE%" (
  set "NODE_CMD=%BUNDLED_NODE%"
) else (
  echo Node.js was not found.
  echo Install Node.js or run this inside Codex so the bundled runtime is available.
  pause
  exit /b 1
)

if not exist "%SKILL_FILE%" (
  echo Missing skill: automotive-marketing-materials
  echo Expected: %SKILL_FILE%
  echo Please install the skill before using this UI.
  pause
  exit /b 1
)

if not exist "node_modules\.bin\codex.cmd" (
  where npm >nul 2>nul
  if %errorlevel%==0 (
    echo Installing dependencies...
    npm install
  ) else (
    echo Missing dependencies and npm was not found.
    echo Install Node.js from https://nodejs.org, then run start.bat again.
    pause
    exit /b 1
  )
)

echo Starting Automotive Skill UI...
"%NODE_CMD%" bridge.js
