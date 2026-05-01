"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const path = require("path");
const os = require("os");
const pty = require("node-pty");
const platform = os.platform();
function getShell() {
    if (platform === 'win32') {
        return 'powershell.exe';
    }
    // Assume bash for now on other platforms, can be made more robust
    return 'bash';
}
function createWindow() {
    const win = new electron_1.BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: false,
            contextIsolation: true,
        },
    });
    const shell = getShell();
    const shellIntegrationScript = path.join(__dirname, '..', 'shell-integration', platform === 'win32' ? 'powershell.ps1' : 'bash.sh' // or zsh.sh
    );
    let args = [];
    if (shell === 'powershell.exe') {
        args = ['-NoExit', '-File', shellIntegrationScript];
    }
    else if (shell === 'bash') {
        args = ['--init-file', shellIntegrationScript];
    }
    // Add case for zsh if zsh.sh is confirmed to work
    const ptyProcess = pty.spawn(shell, args, {
        name: 'xterm-256color',
        cols: 80,
        rows: 30,
        cwd: process.env.HOME,
        env: Object.assign(Object.assign({}, process.env), { VSCODE_INJECTION: '1' })
    });
    // Send pty data to renderer
    ptyProcess.onData(data => {
        win.webContents.send('pty-data', data);
    });
    // Handle pty exit
    ptyProcess.onExit(({ exitCode, signal }) => {
        console.log(`PTY process exited with exit code ${exitCode} and signal ${signal}`);
        win.webContents.send('pty-exit');
    });
    // Handle renderer input
    electron_1.ipcMain.on('pty-input', (event, data) => {
        ptyProcess.write(data);
    });
    // Handle renderer resize
    electron_1.ipcMain.on('pty-resize', (event, { rows, cols }) => {
        ptyProcess.resize(cols, rows);
    });
    // Kill pty process on window close
    win.on('close', () => {
        ptyProcess.kill();
    });
    if (process.env.VITE_DEV_SERVER_URL) {
        win.loadURL(process.env.VITE_DEV_SERVER_URL);
        win.webContents.openDevTools();
    }
    else {
        win.loadFile(path.join(__dirname, '../dist/index.html'));
    }
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
