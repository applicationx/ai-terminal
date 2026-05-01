import { useState, useRef } from 'react';
import { Terminal, TerminalHandle } from './components/Terminal';
import { IntentInput } from './components/IntentInput';
import { Suggestion } from './components/Suggestion';

function App() {
    const [cwd, setCwd] = useState('');
    const [suggestion, setSuggestion] = useState('');
    const terminalRef = useRef<TerminalHandle>(null);

    const handleRun = () => {
        if (suggestion) {
            terminalRef.current?.sendInput(suggestion);
        }
        setSuggestion('');
    };

    const handleDismiss = () => {
        setSuggestion('');
    };

    return (
        <div style={{
            width: '100vw',
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#1e1e1e'
        }}>
            <div style={{ flex: 1, overflow: 'hidden' }}>
                <Terminal ref={terminalRef} setCwd={setCwd} />
            </div>
            {suggestion && (
                <Suggestion
                    command={suggestion}
                    onRun={handleRun}
                    onDismiss={handleDismiss}
                />
            )}
            <IntentInput cwd={cwd} onSuggestion={setSuggestion} />
        </div>
    );
}

export default App;
