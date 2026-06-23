const { app, BrowserWindow, Menu, shell } = require('electron');
const path = require('node:path');

const isDev = Boolean(process.env.ELECTRON_DEV_SERVER_URL) && !process.env.ELECTRON_FORCE_PROD;
const isSmokeTest = process.argv.includes('--smoke-test');
const appBackground = '#faf9f6';

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
