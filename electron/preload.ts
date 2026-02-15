import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
    sendInput: (data: string) => ipcRenderer.send('terminal-input', data),
    onData: (callback: (data: string) => void) => {
        ipcRenderer.on('terminal-output', (_event, value) => callback(value));
    },
    resize: (cols: number, rows: number) => ipcRenderer.send('terminal-resize', { cols, rows }),
});
