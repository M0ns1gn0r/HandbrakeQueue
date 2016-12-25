import { BrowserWindow } from 'electron';

export default class Main {
    static mainWindow: Electron.BrowserWindow;
    static application: Electron.App;
    static BrowserWindow: typeof BrowserWindow;

    private static onWindowAllClosed() {
        if (process.platform !== 'darwin') {
            Main.application.quit();
        }
    }

    private static onClose() {
        // Dereference the window object.
        Main.mainWindow = null;
    }

    private static onReady() {
        const w = new Main.BrowserWindow({width: 800, height: 600});
        
        Main.mainWindow = w;
        w.loadURL('file://' + __dirname + '/../html/index.html');
        w.on('closed', Main.onClose);

        // Open the DevTools.        
        w.webContents.openDevTools({ detach: true });

        // Disable main menu.
        w.setMenu(null);
    }

    static main(app: Electron.App, browserWindow: typeof BrowserWindow){
        // we pass the Electron.App object and the
        // Electron.BrowserWindow into this function
        // so this class has no dependencies.  This
        // makes the code easier to write tests for
        Main.BrowserWindow = browserWindow;

        Main.application = app;
        app.on('window-all-closed', Main.onWindowAllClosed);
        app.on('ready', Main.onReady);
    }
}