const { app, BrowserWindow, Menu, shell } = require('electron');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const isDev = Boolean(process.env.ELECTRON_DEV_SERVER_URL) && !process.env.ELECTRON_FORCE_PROD;
const isSmokeTest = process.argv.includes('--smoke-test');
const appBackground = '#faf9f6';
let smokeProfileRoot;
let ownsSmokeProfileRoot = false;

function configureSmokeRuntime() {
  if (!isSmokeTest) return;

  smokeProfileRoot = process.env.ELECTRON_SMOKE_PROFILE_ROOT;
  if (!smokeProfileRoot) {
    smokeProfileRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'ai-learning-app-smoke-'));
    ownsSmokeProfileRoot = true;
  }
  const userDataDir = path.join(smokeProfileRoot, 'userData');
  const sessionDataDir = path.join(smokeProfileRoot, 'sessionData');
  fs.mkdirSync(userDataDir, { recursive: true });
  fs.mkdirSync(sessionDataDir, { recursive: true });

  app.setPath('userData', userDataDir);
  app.setPath('sessionData', sessionDataDir);
  app.disableHardwareAcceleration();
  app.commandLine.appendSwitch('disable-gpu');
  app.commandLine.appendSwitch('disable-gpu-compositing');
  app.commandLine.appendSwitch('disable-gpu-shader-disk-cache');
  app.commandLine.appendSwitch('disable-http-cache');
  app.commandLine.appendSwitch('disk-cache-size', '1');
  app.commandLine.appendSwitch('media-cache-size', '1');
  app.commandLine.appendSwitch('disable-features', 'CalculateNativeWinOcclusion');
}

function cleanupSmokeRuntime() {
  if (!smokeProfileRoot || !ownsSmokeProfileRoot) return;
  try {
    fs.rmSync(smokeProfileRoot, { recursive: true, force: true });
  } catch {
    // Best-effort cleanup only; smoke result should not depend on temp deletion.
  }
}

function isExternalUrl(url) {
  return /^(https?:|mailto:)/i.test(url);
}

function createMainWindow() {
  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 820,
    minWidth: 1024,
    minHeight: 720,
    backgroundColor: appBackground,
    show: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true,
      webSecurity: true,
    },
  });

  mainWindow.once('ready-to-show', () => {
    if (!isSmokeTest) {
      mainWindow.show();
    }
  });

  mainWindow.webContents.once('did-finish-load', () => {
    if (isSmokeTest) {
      setTimeout(() => app.quit(), 250);
    }
  });

  mainWindow.webContents.once('did-fail-load', (_event, errorCode, errorDescription) => {
    if (isSmokeTest) {
      console.error(`Electron smoke test failed: ${errorCode} ${errorDescription}`);
      app.exit(1);
    }
  });

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (isExternalUrl(url)) {
      shell.openExternal(url);
    }
    return { action: 'deny' };
  });

  mainWindow.webContents.on('will-navigate', (event, url) => {
    if (!isExternalUrl(url)) return;
    event.preventDefault();
    shell.openExternal(url);
  });

  mainWindow.webContents.session.setPermissionRequestHandler((_webContents, _permission, callback) => {
    callback(false);
  });

  if (isDev) {
    mainWindow.loadURL(process.env.ELECTRON_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(path.join(app.getAppPath(), 'dist', 'index.html'));
  }

  return mainWindow;
}

app.setName('AI \u5de5\u7a0b\u5b66\u4e60');
configureSmokeRuntime();

app.whenReady().then(() => {
  Menu.setApplicationMenu(null);
  createMainWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('quit', cleanupSmokeRuntime);
