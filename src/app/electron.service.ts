import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ElectronService {
  writeFile(filePath: string, content: string): Promise<{ success: boolean, error?: string }> {
    return (window as any).electron.ipcRenderer.invoke('write-file', { filePath, content });
  }

  showSaveDialog(options: { title: string, defaultPath: string }): Promise<{ canceled: boolean, filePath?: string }> {
    return (window as any).electron.ipcRenderer.invoke('show-save-dialog', options);
  }
}