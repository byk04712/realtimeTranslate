import { app, BrowserWindow, ipcMain } from 'electron';
import { join } from 'path';
import Store from 'electron-store';

// 初始化存储
const store = new Store();

let mainWindow: BrowserWindow | null = null;

function createWindow() {
  // 创建浏览器窗口
  mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      nodeIntegration: true,
      contextIsolation: true
    }
  });

  // 加载应用
  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:3000');
    // 打开开发工具
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'));
  }

  // 窗口关闭时触发
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// 应用准备就绪时创建窗口
app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    // 在macOS上，当点击dock图标并且没有其他窗口打开时，
    // 通常在应用程序中重新创建一个窗口。
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// 除了 macOS 外，当所有窗口都被关闭的时候退出程序
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// 设置IPC通信
ipcMain.handle('get-settings', () => {
  return store.get('settings');
});

ipcMain.handle('save-settings', (_, settings) => {
  store.set('settings', settings);
  return true;
});

ipcMain.handle('get-history', () => {
  return store.get('history') || [];
});

ipcMain.handle('save-history', (_, historyItem) => {
  const history = store.get('history') || [];
  history.push({
    ...historyItem,
    timestamp: new Date().toISOString()
  });
  store.set('history', history);
  return true;
});

ipcMain.handle('clear-history', () => {
  store.set('history', []);
  return true;
});