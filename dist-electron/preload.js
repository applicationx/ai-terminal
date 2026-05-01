"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
electron_1.contextBridge.exposeInMainWorld('pty', {
    /**
     * Listens for data from the PTY process and invokes the callback.
     * @param callback The function to call with the data.
     * @returns A function to unsubscribe the listener.
     */
    onData: (callback) => {
        const listener = (_event, data) => callback(data);
        electron_1.ipcRenderer.on('pty-data', listener);
        // Return a cleanup function to remove the listener
        return () => {
            electron_1.ipcRenderer.removeListener('pty-data', listener);
        };
    },
    /**
     * Sends input to the PTY process.
     * @param data The input string.
     */
    sendInput: (data) => {
        electron_1.ipcRenderer.send('pty-input', data);
    },
    /**
     * Sends resize events to the PTY process.
     * @param size The new dimensions.
     */
    sendResize: (size) => {
        electron_1.ipcRenderer.send('pty-resize', size);
    }
});
