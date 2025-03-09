"use strict";
const electron = require("electron");
const path = require("path");
const Store = require("electron-store");
const store = new Store();
let mainWindow = null;
function createWindow() {
  mainWindow = new electron.BrowserWindow({
    width: 900,
    height: 670,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      preload: path.join(__dirname, "../preload/index.js"),
      nodeIntegration: true,
      contextIsolation: false
    }
  });
  if (process.env.NODE_ENV === "development") {
    mainWindow.loadURL("http://localhost:3000");
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, "../renderer/index.html"));
  }
  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}
electron.app.whenReady().then(() => {
  createWindow();
  electron.app.on("activate", () => {
    if (electron.BrowserWindow.getAllWindows().length === 0)
      createWindow();
  });
});
electron.app.on("window-all-closed", () => {
  if (process.platform !== "darwin")
    electron.app.quit();
});
electron.ipcMain.handle("get-settings", () => {
  return store.get("settings");
});
electron.ipcMain.handle("save-settings", (_, settings) => {
  store.set("settings", settings);
  return true;
});
electron.ipcMain.handle("get-history", () => {
  return store.get("history") || [];
});
electron.ipcMain.handle("save-history", (_, historyItem) => {
  const history = store.get("history") || [];
  history.push({
    ...historyItem,
    timestamp: (/* @__PURE__ */ new Date()).toISOString()
  });
  store.set("history", history);
  return true;
});
electron.ipcMain.handle("clear-history", () => {
  store.set("history", []);
  return true;
});
