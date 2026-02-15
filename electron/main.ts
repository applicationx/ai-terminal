import { app, BrowserWindow, ipcMain } from 'electron';
import * as path from 'path';
import * as os from 'os';
// import * as pty from 'node-pty'; // Commented out until node-pty is installed

const shell = os.platform() === 'win32' ? 'powershell.exe' : 'bash';

function createWindow() {
    const win = new BrowserWindow({
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
    } else {
        // Check if dist/index.html exists, otherwise load a placeholder or error
        win.loadFile(path.join(__dirname, '../dist/index.html'));
    }

    // PTY logic placeholder
    ipcMain.on('terminal-input', (event, data) => {
        // ptyProcess.write(data);
        console.log('Terminal input:', data);
    });

    ipcMain.on('terminal-resize', (event, size) => {
        // ptyProcess.resize(size.cols, size.rows);
        console.log('Terminal resize:', size);
    });
}

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
