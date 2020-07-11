const { app, BrowserWindow } = require("electron");
const isDev = require("electron-is-dev");

app.on("ready", () => {
  console.log("Ready!");
  const mainWindow = new BrowserWindow({
    show: false,
    webPreferences: {
      nodeIntegration: false,
      enableRemoteModule: false,
      contextIsolation: true,
    },
  });

  if (!isDev) {
    mainWindow.loadFile(`${__dirname}/index.html`);
  } else {
    mainWindow.loadURL("http://localhost:3000");
  }

  mainWindow.once("ready-to-show", () => {
    mainWindow.show();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

console.log("Starting...");
