interface SuggestionProps {
    command: string;
    onRun: () => void;
    onDismiss: () => void;
}

export const Suggestion = ({ command, onRun, onDismiss }: SuggestionProps) => {
    return (
        <div style={{
            padding: '10px',
            borderTop: '1px solid #333',
            backgroundColor: '#2d2d2d'
        }}>
            <div style={{ marginBottom: '10px', color: '#ccc' }}>
                Suggested Command:
            </div>
            <pre style={{
                backgroundColor: '#1e1e1e',
                color: '#d4d4d4',
                padding: '10px',
                borderRadius: '4px',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-all'
            }}>
                <code>{command}</code>
            </pre>
            <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'flex-end' }}>
                <button
                    onClick={onDismiss}
                    style={{
                        padding: '8px 12px',
                        fontSize: '14px',
                        border: '1px solid #555',
                        borderRadius: '4px',
                        backgroundColor: '#3c3c3c',
                        color: 'white',
                        cursor: 'pointer',
                        marginRight: '10px'
                    }}
                >
                    Dismiss
                </button>
                <button
                    onClick={onRun}
                    style={{
                        padding: '8px 12px',
                        fontSize: '14px',
                        border: '1px solid #555',
                        borderRadius: '4px',
                        backgroundColor: '#0e639c',
                        color: 'white',
                        cursor: 'pointer'
                    }}
                >
                    Run
                </button>
            </div>
        </div>
    );
};
