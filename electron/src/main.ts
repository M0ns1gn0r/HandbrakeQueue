import { BrowserWindow, app, ipcMain, dialog } from 'electron'
import * as fs from 'fs'
import * as path from 'path'

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
// eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
if (require('electron-squirrel-startup')) app.quit()

const loadApp = (win: BrowserWindow): void => {
  void win.loadURL(new URL(path.join('file:', __dirname, '../../dist/browser/index.html')).href)
}

let win: BrowserWindow | null

const createWindow = (): void => {
  // Create the browser window.
  win = new BrowserWindow({
    width: 1020,
    height: 950,
    resizable: true,
    icon: path.join(__dirname, '../../dist/browser/favicon.ico'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
  })

  // Disable main menu.
  win.setMenu(null);

  // Open the DevTools.
  if (!app.isPackaged) {
      win.webContents.openDevTools({ mode: 'detach' });
  }

  loadApp(win)

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store window
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null
  })

  // Fix issue with blank screen on reload
  win.webContents.on('did-fail-load', () => {
    if (win !== null) loadApp(win)
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  createWindow()
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

ipcMain.handle('fs:writeFile', async (event, { filePath, content }) => {
  try {
    await fs.promises.writeFile(filePath, content);
    return { success: true };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
});

ipcMain.handle('dialog:showSaveDialog', (event, options) => dialog.showSaveDialog(options));

ipcMain.on('path:dirname', (event, p) => event.returnValue = path.dirname(p));
ipcMain.on('path:basename', (event, p) => event.returnValue = path.basename(p));
ipcMain.on('path:join', (event, paths) => event.returnValue = path.join(...paths));
ipcMain.on('path:parse', (event, p) => event.returnValue = path.parse(p));
ipcMain.on('path:sep', (event) => event.returnValue = path.sep);

