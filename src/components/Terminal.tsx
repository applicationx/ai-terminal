import { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { Terminal as XTerm } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import 'xterm/css/xterm.css';

// Define the exposed API for type safety
declare global {
  interface Window {
    pty?: {
      onData: (callback: (data: string) => void) => () => void;
      sendInput: (data: string) => void;
      sendResize: (size: { rows: number; cols: number }) => void;
    }
  }
}

export interface TerminalHandle {
  sendInput: (input: string) => void;
}

interface TerminalProps {
  setCwd: (cwd: string) => void;
}

export const Terminal = forwardRef<TerminalHandle, TerminalProps>(({ setCwd }, ref) => {
    const terminalRef = useRef<HTMLDivElement>(null);
    const xtermRef = useRef<XTerm | null>(null);

    useImperativeHandle(ref, () => ({
        sendInput(input: string) {
            if (window.pty) {
                window.pty.sendInput(input + '\r'); // Add carriage return to execute
            }
        }
    }));

    useEffect(() => {
        if (!terminalRef.current || xtermRef.current) return;

        const term = new XTerm({
            cursorBlink: true,
            fontFamily: 'Menlo, Monaco, "Courier New", monospace',
            fontSize: 14,
            theme: {
                background: '#1e1e1e',
                foreground: '#d4d4d4',
            },
        });
        xtermRef.current = term;

        const fitAddon = new FitAddon();
        term.loadAddon(fitAddon);

        // Handler for shell integration sequences
        term.parser.registerOscHandler(633, (data) => {
          const parts = data.split(';');
          const command = parts[0];
          console.log('Shell Integration:', parts);

          switch (command) {
            case 'P': // Property
              const property = parts[1].split('=');
              if (property[0] === 'Cwd') {
                setCwd(property[1]);
                console.log('New CWD:', property[1]);
              }
              break;
            case 'A': // Prompt Start
              console.log('Prompt Start');
              break;
            case 'B': // Prompt End
              console.log('Prompt End');
              break;
            case 'C': // Command Start
              console.log('Command Start');
              break;
            case 'D': // Command End
              const exitCode = parts[1];
              console.log('Command End, exit code:', exitCode);
              break;
            case 'E': // Command Line
                const cmdLine = parts[1];
                console.log('Command Line:', cmdLine);
                break;
          }
          return true;
        });

        term.open(terminalRef.current);
        term.focus();

        let cleanupOnData: (() => void) | null = null;

        // Handle PTY communication if electron API is available
        if (window.pty) {
            cleanupOnData = window.pty.onData((data) => term.write(data));
            term.onData((data) => window.pty?.sendInput(data));
        } else {
            term.onData((data) => term.write(data));
            term.write('Gemini CLI (mock browser mode)\r\n$ ');
        }

        const resizeObserver = new ResizeObserver(() => {
            fitAddon.fit();
            window.pty?.sendResize({ cols: term.cols, rows: term.rows });
        });
        resizeObserver.observe(terminalRef.current);

        fitAddon.fit();
        window.pty?.sendResize({ cols: term.cols, rows: term.rows });

        return () => {
            cleanupOnData?.();
            term.dispose();
            if (terminalRef.current) {
              resizeObserver.unobserve(terminalRef.current);
            }
            xtermRef.current = null;
        };
    }, [setCwd]);

    return <div ref={terminalRef} style={{ width: '100%', height: '100%', overflow: 'hidden' }} />;
});
