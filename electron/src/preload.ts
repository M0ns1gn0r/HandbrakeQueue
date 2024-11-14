import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electron', {
    fs: {
        writeFile: (filePath: string, content: string) => ipcRenderer.invoke('fs:writeFile', { filePath, content })
    },
    dialog: {
        showSaveDialog: (options: unknown) => ipcRenderer.invoke('dialog:showSaveDialog', options)
    },
    path: {
        dirname: (p: string) => ipcRenderer.sendSync('path:dirname', p),
        basename: (p: string) => ipcRenderer.sendSync('path:basename', p),
        join: (...paths: string[]) => ipcRenderer.sendSync('path:join', paths),
        parse: (p: string) => ipcRenderer.sendSync('path:parse', p),
        sep: () => ipcRenderer.sendSync('path:sep')
    }
});
