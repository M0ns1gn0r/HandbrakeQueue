import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class IoService {
  private ipcRenderer = window.electron.ipcRenderer;

  writeFile(filePath: string, content: string): Promise<{ success: boolean, error?: string }> {
    return this.ipcRenderer.invoke('write-file', { filePath, content });
  }
}