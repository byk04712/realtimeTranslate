"use strict";
const electron = require("electron");
electron.contextBridge.exposeInMainWorld("electronAPI", {
  // 设置相关
  getSettings: () => electron.ipcRenderer.invoke("get-settings"),
  saveSettings: (settings) => electron.ipcRenderer.invoke("save-settings", settings),
  // 历史记录相关
  getHistory: () => electron.ipcRenderer.invoke("get-history"),
  saveHistory: (historyItem) => electron.ipcRenderer.invoke("save-history", historyItem),
  clearHistory: () => electron.ipcRenderer.invoke("clear-history")
});
