"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const path = require("path");
const os = require("os");
// import * as pty from 'node-pty'; // Commented out until node-pty is installed
const shell = os.platform() === 'win32' ? 'powershell.exe' : 'bash';
function createWindow() {
    const win = new electron_1.BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: false,
            contextIsolation: true,
        },
    });
    if (process.env.VITE_DEV_SERVER_URL) {
        win.loadURL(process.env.VITE_DEV_SERVER_URL);
    }
    else {
        // Check if dist/index.html exists, otherwise load a placeholder or error
        win.loadFile(path.join(__dirname, '../dist/index.html'));
    }
    // PTY logic placeholder
    electron_1.ipcMain.on('terminal-input', (event, data) => {
        // ptyProcess.write(data);
        console.log('Terminal input:', data);
    });
    electron_1.ipcMain.on('terminal-resize', (event, size) => {
        // ptyProcess.resize(size.cols, size.rows);
        console.log('Terminal resize:', size);
    });
}
electron_1.app.whenReady().then(() => {
    createWindow();
    electron_1.app.on('activate', () => {
        if (electron_1.BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});
electron_1.app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        electron_1.app.quit();
    }
});
