interface Window {
    electron: {
        ipcRenderer: {
            invoke(channel: 'write-file', args: { filePath: string, content: string }): Promise<{ success: boolean, error?: string }>;
        }
    }
}
