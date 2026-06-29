@echo off
setlocal

pushd "%~dp0" || exit /b 1

call scripts\start-local.cmd electron
set "EXIT_CODE=%ERRORLEVEL%"

popd
exit /b %EXIT_CODE%
