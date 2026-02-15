"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
electron_1.contextBridge.exposeInMainWorld('electronAPI', {
    sendInput: (data) => electron_1.ipcRenderer.send('terminal-input', data),
    onData: (callback) => {
        electron_1.ipcRenderer.on('terminal-output', (_event, value) => callback(value));
    },
    resize: (cols, rows) => electron_1.ipcRenderer.send('terminal-resize', { cols, rows }),
});
