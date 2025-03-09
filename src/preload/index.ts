import { contextBridge, ipcRenderer } from 'electron';

// 暴露API给渲染进程
contextBridge.exposeInMainWorld('electronAPI', {
  // 设置相关
  getSettings: () => ipcRenderer.invoke('get-settings'),
  saveSettings: (settings: any) => ipcRenderer.invoke('save-settings', settings),
  
  // 历史记录相关
  getHistory: () => ipcRenderer.invoke('get-history'),
  saveHistory: (historyItem: any) => ipcRenderer.invoke('save-history', historyItem),
  clearHistory: () => ipcRenderer.invoke('clear-history')
});