@echo off
cd /d "D:\AI项目\AI-Learning-App"
start "" /B node_modules\.bin\vite.cmd --mode desktop --host 127.0.0.1 --port 5173 --strictPort
start "" /B cmd /c "wait-on tcp:127.0.0.1:5173 && cross-env ELECTRON_DEV_SERVER_URL=http://127.0.0.1:5173 node_modules\.bin\electron.cmd . --disable-gpu --disable-software-rasterizer --no-sandbox --user-data-dir=%CD%\output\electron-user-data"
ping -n 10 127.0.0.1 >nul
netstat -ano | findstr ":5173"
