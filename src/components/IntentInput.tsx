import { useState } from 'react';
import { getCommandSuggestion } from '../services/llm';

interface IntentInputProps {
    cwd: string;
    onSuggestion: (suggestion: string) => void;
}

export const IntentInput = ({ cwd, onSuggestion }: IntentInputProps) => {
    const [value, setValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async () => {
        if (!value.trim() || isLoading) return;

        setIsLoading(true);
        try {
            const suggestion = await getCommandSuggestion(value, {
                cwd,
                os: window?.navigator.platform ?? 'unknown'
            });
            onSuggestion(suggestion);
        } catch (error) {
            console.error('Failed to get suggestion:', error);
            const errorMessage = error instanceof Error ? error.message : "Unknown error";
            onSuggestion(`echo "Error: ${errorMessage}"`);
        } finally {
            setValue('');
            setIsLoading(false);
        }
    };

    return (
        <div style={{
            padding: '10px',
            display: 'flex',
            borderTop: '1px solid #333'
        }}>
            <input
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                placeholder={isLoading ? "Getting suggestion..." : "Type your command in natural language..."}
                disabled={isLoading}
                style={{
                    flex: 1,
                    padding: '8px',
                    fontSize: '14px',
                    border: '1px solid #555',
                    borderRadius: '4px',
                    backgroundColor: '#252526',
                    color: '#ccc',
                    opacity: isLoading ? 0.7 : 1
                }}
            />
            <button
                onClick={handleSubmit}
                disabled={isLoading}
                style={{
                    marginLeft: '10px',
                    padding: '8px 12px',
                    fontSize: '14px',
                    border: '1px solid #555',
                    borderRadius: '4px',
                    backgroundColor: '#0e639c',
                    color: 'white',
                    cursor: isLoading ? 'wait' : 'pointer',
                    opacity: isLoading ? 0.7 : 1
                }}
            >
                {isLoading ? 'Sending...' : 'Send'}
            </button>
        </div>
    );
};
