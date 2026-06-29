@echo off
setlocal

pushd "%~dp0\.." || exit /b 1

set "MODE=%~1"
if "%MODE%"=="" set "MODE=help"

if /I "%MODE%"=="web" goto web
if /I "%MODE%"=="electron" goto electron
if /I "%MODE%"=="all" goto electron
if /I "%MODE%"=="electron-attach" goto electron_attach
if /I "%MODE%"=="help" goto help
goto help

:web
echo Starting Web dev server: http://127.0.0.1:5173/
call npm run dev -- --host 127.0.0.1 --port 5173
set "EXIT_CODE=%ERRORLEVEL%"
goto done

:electron
echo Starting Electron dev app with its own Vite server on 127.0.0.1:5173.
echo Stop any existing process on port 5173 first, or use electron-attach.
call :ensure_port_5173_free
if errorlevel 1 (
  set "EXIT_CODE=1"
  goto done
)
call :prepare_electron_runtime
call npm run dev:desktop
set "EXIT_CODE=%ERRORLEVEL%"
goto done

:electron_attach
echo Starting Electron against an already-running Web server on http://127.0.0.1:5173/.
call node node_modules\wait-on\bin\wait-on tcp:127.0.0.1:5173
if errorlevel 1 (
  set "EXIT_CODE=%ERRORLEVEL%"
  goto done
)
call :prepare_electron_runtime
set "ELECTRON_DEV_SERVER_URL=http://127.0.0.1:5173"
call node_modules\.bin\electron.cmd .
set "EXIT_CODE=%ERRORLEVEL%"
goto done

:ensure_port_5173_free
node -e "const net=require('node:net'); const s=net.connect(5173,'127.0.0.1'); s.on('connect',()=>{s.destroy();process.exit(1)}); s.on('error',()=>process.exit(0)); setTimeout(()=>process.exit(0),1000);"
if errorlevel 1 echo Port 5173 is already in use. Keep the Web server running and use scripts\start-local.cmd electron-attach instead.
exit /b %ERRORLEVEL%

:prepare_electron_runtime
if not defined ELECTRON_LOCAL_PROFILE_ROOT (
  set "ELECTRON_LOCAL_PROFILE_ROOT=%TEMP%\ai-learning-app-dev-%RANDOM%-%RANDOM%"
)
set "ELECTRON_LOCAL_CLEANUP_PROFILE=1"
mkdir "%ELECTRON_LOCAL_PROFILE_ROOT%" >nul 2>nul
exit /b 0

:help
echo Usage:
echo   scripts\start-local.cmd web              Start Web dev server at http://127.0.0.1:5173/
echo   scripts\start-local.cmd electron         Start Electron dev app with its own Vite server
echo   scripts\start-local.cmd electron-attach  Start Electron using an existing Web server on 5173
echo.
echo Notes:
echo   Run from any directory; the script switches to the repository root.
echo   Prefer this script on Windows so npm resolves through cmd/npm.cmd, not PowerShell npm.ps1.
set "EXIT_CODE=0"
goto done

:done
popd
exit /b %EXIT_CODE%