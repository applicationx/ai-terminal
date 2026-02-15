/// <reference types="vite/client" />

interface Window {
    electronAPI: {
        sendInput: (data: string) => void;
        onData: (callback: (data: string) => void) => void;
        resize: (cols: number, rows: number) => void;
    };
}
