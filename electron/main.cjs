const { app, BrowserWindow, Menu, shell } = require('electron');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const isDev = Boolean(process.env.ELECTRON_DEV_SERVER_URL) && !process.env.ELECTRON_FORCE_PROD;
const isSmokeTest = process.argv.includes('--smoke-test');
const localProfileRoot = process.env.ELECTRON_LOCAL_PROFILE_ROOT;
const appBackground = '#faf9f6';
let isolatedProfileRoot;
let ownsIsolatedProfileRoot = false;

function configureIsolatedRuntime() {
  if (!isSmokeTest && !localProfileRoot) return;

  isolatedProfileRoot = localProfileRoot || process.env.ELECTRON_SMOKE_PROFILE_ROOT;
  if (!isolatedProfileRoot) {
    isolatedProfileRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'ai-learning-app-smoke-'));
    ownsIsolatedProfileRoot = true;
  } else {
    ownsIsolatedProfileRoot = process.env.ELECTRON_LOCAL_CLEANUP_PROFILE === '1';
  }
  const userDataDir = path.join(isolatedProfileRoot, 'userData');
  const sessionDataDir = path.join(isolatedProfileRoot, 'sessionData');
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

function cleanupIsolatedRuntime() {
  if (!isolatedProfileRoot || !ownsIsolatedProfileRoot) return;
  try {
    fs.rmSync(isolatedProfileRoot, { recursive: true, force: true });
  } catch {
    // Best-effort cleanup only; runtime result should not depend on temp deletion.
  }
}

const allowedExternalHosts = new Set([
  'github.com',
  'www.github.com',
  'gsap.com',
  'www.gsap.com',
]);

function getAllowedExternalUrl(url) {
  try {
    const parsed = new URL(url);
    if (parsed.protocol === 'mailto:') return url;
    if (!['http:', 'https:'].includes(parsed.protocol)) return null;
    return allowedExternalHosts.has(parsed.hostname.toLowerCase()) ? url : null;
  } catch {
    return null;
  }
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
    const externalUrl = getAllowedExternalUrl(url);
    if (externalUrl) {
      shell.openExternal(externalUrl);
    }
    return { action: 'deny' };
  });

  mainWindow.webContents.on('will-navigate', (event, url) => {
    const externalUrl = getAllowedExternalUrl(url);
    if (!externalUrl) {
      if (/^(https?:|mailto:)/i.test(url)) event.preventDefault();
      return;
    }
    event.preventDefault();
    shell.openExternal(externalUrl);
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
configureIsolatedRuntime();

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

app.on('quit', cleanupIsolatedRuntime);
