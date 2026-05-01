import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('pty', {
  /**
   * Listens for data from the PTY process and invokes the callback.
   * @param callback The function to call with the data.
   * @returns A function to unsubscribe the listener.
   */
  onData: (callback: (data: string) => void) => {
    const listener = (_event: any, data: string) => callback(data);
    ipcRenderer.on('pty-data', listener);
    // Return a cleanup function to remove the listener
    return () => {
      ipcRenderer.removeListener('pty-data', listener);
    };
  },
  /**
   * Sends input to the PTY process.
   * @param data The input string.
   */
  sendInput: (data: string) => {
    ipcRenderer.send('pty-input', data);
  },
  /**
   * Sends resize events to the PTY process.
   * @param size The new dimensions.
   */
  sendResize: (size: { rows: number; cols: number }) => {
    ipcRenderer.send('pty-resize', size);
  }
});
