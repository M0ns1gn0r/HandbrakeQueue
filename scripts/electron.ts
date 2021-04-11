import { app, BrowserWindow } from 'electron';

/** Indicates that the app was packaged and is running in the "production" mode. */
function isPackaged(): boolean {
    return !__dirname.endsWith('compiled');
}

class Main {
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
        const w = new Main.BrowserWindow({
            width: 800,
            height: 625,
            icon: __dirname + '/../icon.ico',
            webPreferences: {
                nodeIntegration: true
            }
        });

        Main.mainWindow = w;
        w.loadURL(`file://${__dirname}/${isPackaged() ? '' : '../'}index.html`);
        w.on('closed', Main.onClose);

        // Open the DevTools.
        if (!isPackaged()) {
            w.webContents.openDevTools({ mode: 'detach' });
        }

        // Disable main menu.
        w.setMenu(null);
    }

    static main(app: Electron.App, browserWindow: typeof BrowserWindow) {
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

Main.main(app, BrowserWindow);
