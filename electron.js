const { app, BrowserWindow, globalShortcut } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: {
      contextIsolation: false,
      nodeIntegration: false,
      webSecurity: false, // 关闭跨域限制
    },
  });

  // 加载远程页面
  win.loadURL('http://120.55.61.17:21387');

  // 自动打开开发者工具（外置窗口）
  win.webContents.openDevTools({ mode: 'detach' });

  // 加载失败监听
  win.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
    console.error('页面加载失败：', errorDescription);
  });
}

app.whenReady().then(() => {
  createWindow();

  // 注册全局快捷键 F12：打开/关闭控制台
  globalShortcut.register('F12', () => {
    const focusedWindow = BrowserWindow.getFocusedWindow();
    if (focusedWindow) {
      const wc = focusedWindow.webContents;
      wc.isDevToolsOpened() ? wc.closeDevTools() : wc.openDevTools({ mode: 'detach' });
    }
  });

  // macOS 特有行为：无窗口时点击 dock 图标重新打开
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// 所有窗口关闭时退出（除了 macOS）
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
