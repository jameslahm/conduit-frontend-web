const { app, BrowserWindow, ipcMain } = require("electron");
const isDev = require("electron-is-dev");
const { autoUpdater } = require("electron-updater");

app.on("ready", () => {
  console.log("Ready!");
  const mainWindow = new BrowserWindow({
    show: false,
    webPreferences: {
      nodeIntegration: false,
      enableRemoteModule: false,
      contextIsolation: true,
      preload: `${__dirname}/preload.js`,
    },
  });

  if (!isDev) {
    mainWindow.loadFile(`${__dirname}/index.html`);
  } else {
    mainWindow.loadURL("http://localhost:3000");
  }

  mainWindow.once("ready-to-show", () => {
    mainWindow.show();
    autoUpdater.checkForUpdatesAndNotify();
  });

  autoUpdater.on("update-downloaded", () => {
    mainWindow.webContents.send("update_downloaded");
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

ipcMain.on("restart_app", () => {
  autoUpdater.quitAndInstall();
});

console.log("Starting...");
