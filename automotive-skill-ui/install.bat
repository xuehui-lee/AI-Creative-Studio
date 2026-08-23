@echo off
setlocal
cd /d "%~dp0"

set "SKILL_NAME=automotive-marketing-materials"
set "SKILL_SRC=%~dp0skills\%SKILL_NAME%"
set "SKILL_DEST=%USERPROFILE%\.codex\skills\%SKILL_NAME%"

echo Installing Automotive Skill UI...

if not exist "%SKILL_SRC%\SKILL.md" (
  echo Missing packaged skill: %SKILL_SRC%
  echo Please use the full installer package.
  pause
  exit /b 1
)

if exist "%SKILL_DEST%\SKILL.md" (
  echo Skill already installed: %SKILL_DEST%
) else (
  echo Installing skill to: %SKILL_DEST%
  mkdir "%USERPROFILE%\.codex\skills" 2>nul
  xcopy "%SKILL_SRC%" "%SKILL_DEST%" /E /I /Y >nul
  if errorlevel 1 (
    echo Failed to install skill.
    pause
    exit /b 1
  )
)

where node >nul 2>nul
if errorlevel 1 (
  echo Node.js was not found.
  echo Install Node.js LTS from https://nodejs.org, then run install.bat again.
  pause
  exit /b 1
)

where npm >nul 2>nul
if errorlevel 1 (
  echo npm was not found.
  echo Install Node.js LTS from https://nodejs.org, then run install.bat again.
  pause
  exit /b 1
)

if not exist "node_modules\.bin\codex.cmd" (
  echo Installing UI dependencies...
  call npm install
  if errorlevel 1 (
    echo Failed to install dependencies.
    pause
    exit /b 1
  )
) else (
  echo UI dependencies already installed.
)

echo.
echo Install complete.
echo Run start.bat, then open http://localhost:8787/
pause
