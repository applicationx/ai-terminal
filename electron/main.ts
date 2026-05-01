import { app, BrowserWindow, ipcMain } from 'electron';
import * as path from 'path';
import * as os from 'os';
import * as pty from 'node-pty';

const platform = os.platform();

function getShell() {
  if (platform === 'win32') {
    return 'powershell.exe';
  }
  // Assume bash for now on other platforms, can be made more robust
  return 'bash';
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  const shell = getShell();
  const shellIntegrationScript = path.join(__dirname, '..', 'shell-integration',
    platform === 'win32' ? 'powershell.ps1' : 'bash.sh' // or zsh.sh
  );

  let args: string[] = [];
  if (shell === 'powershell.exe') {
    args = ['-NoExit', '-File', shellIntegrationScript];
  } else if (shell === 'bash') {
    args = ['--init-file', shellIntegrationScript];
  }
  // Add case for zsh if zsh.sh is confirmed to work

  const ptyProcess = pty.spawn(shell, args, {
    name: 'xterm-256color',
    cols: 80,
    rows: 30,
    cwd: process.env.HOME,
    env: {
      ...process.env,
      VSCODE_INJECTION: '1'
    }
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
  ipcMain.on('pty-input', (event, data) => {
    ptyProcess.write(data);
  });

  // Handle renderer resize
  ipcMain.on('pty-resize', (event, { rows, cols }) => {
    ptyProcess.resize(cols, rows);
  });

  // Kill pty process on window close
  win.on('close', () => {
    ptyProcess.kill();
  });


  if (process.env.VITE_DEV_SERVER_URL) {
    win.loadURL(process.env.VITE_DEV_SERVER_URL);
    win.webContents.openDevTools();
  } else {
    win.loadFile(path.join(__dirname, '../dist/index.html'));
  }
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
