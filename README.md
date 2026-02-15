# AI Terminal

An AI-powered terminal emulator built with Electron, React, and xterm.js.

## Prerequisites

- Node.js (v16 or higher)
- npm

### Windows Requirements

Run the provided batch script to install dependencies:

```cmd
setup-win.bat
```

### Linux/WSL Requirements

For convenience, you can run the provided setup script to install necessary system libraries and project dependencies:

```bash
./setup.sh
```

Alternatively, you can install the libraries manually (Ubuntu 24.04+):

```bash
sudo apt-get update
sudo apt-get install libnss3 libnspr4 libatk1.0-0t64 libatk-bridge2.0-0t64 libcups2t64 libdrm2 \
    libxkbcommon0 libxcomposite1 libxdamage1 libxfixes3 libxrandr2 libgbm1 libasound2t64
```

### Troubleshooting
If the application fails to start on WSL:
- Ensure you are running on **WSL 2**.
- If you see `error while loading shared libraries`, run `./setup.sh` again to ensure all dependencies are installed.
- If the window does not appear, ensure **WSLg** is working (try running `xclock` or `gedit` to verify GUI apps work). Update your WSL version with `wsl --update` in PowerShell.

## Getting Started

1.  **Install dependencies (if you executed setup.sh, this is already done):**

    ```bash
    npm install
    ```

2.  **Start the application (Development Mode):**

    ```bash
    npm start
    # or
    npm run dev
    ```

    This runs Vite for the renderer process and Electron for the main process concurrently.

## Building the Application

To build the application for production:

1.  **Compile TypeScript and Vite:**

    ```bash
    npm run build
    ```

2.  **Build for your current OS:**

    ```bash
    npx electron-builder build
    ```

### Building for Windows

You can build a Windows installer / executable.

- **On Windows:**
  Run `npm run build:win`

- **On Linux/WSL (Cross-compilation):**
  You can try cross-compiling, but note that native modules like `node-pty` might cause issues. 
  
  ```bash
  npm run build:win
  ```

  If you encounter issues with `node-pty` during cross-compilation, it is recommended to build directly on a Windows machine.

## Architecture

- **Electron:** Main process, window management, system integration.
- **React:** UI/UX, terminal rendering.
- **xterm.js:** Terminal emulation component.
- **node-pty:** Pseudo-terminal integration (currently mocked in dev if build fails).
