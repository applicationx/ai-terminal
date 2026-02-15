import { useEffect, useRef } from 'react';
import { Terminal as XTerm } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import 'xterm/css/xterm.css';

export const Terminal = () => {
    const terminalRef = useRef<HTMLDivElement>(null);
    const xtermRef = useRef<XTerm | null>(null);

    useEffect(() => {
        if (!terminalRef.current) return;

        const term = new XTerm({
            cursorBlink: true,
            fontFamily: 'Menlo, Monaco, "Courier New", monospace',
            fontSize: 14,
            theme: {
                background: '#1e1e1e',
                foreground: '#d4d4d4',
            },
        });

        const fitAddon = new FitAddon();
        term.loadAddon(fitAddon);

        term.open(terminalRef.current);
        fitAddon.fit();

        xtermRef.current = term;

        // Handle input
        term.onData((data) => {
            if (window.electronAPI) {
                window.electronAPI.sendInput(data);
            } else {
                // Mock for browser dev without electron
                term.write(data);
            }
        });

        // Handle output from Electron
        if (window.electronAPI) {
            window.electronAPI.onData((data) => {
                term.write(data);
            });
        }

        // Handle resize
        const handleResize = () => {
            fitAddon.fit();
            if (window.electronAPI) {
                window.electronAPI.resize(term.cols, term.rows);
            }
        };

        window.addEventListener('resize', handleResize);
        // Initial resize after a small delay to ensure container is ready
        setTimeout(handleResize, 100);

        return () => {
            term.dispose();
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return <div ref={terminalRef} style={{ width: '100%', height: '100%', overflow: 'hidden' }} />;
};
