const OLLAMA_URL = 'http://localhost:11434/v1/chat/completions';

// A simple function to get a command suggestion from Ollama
export const getCommandSuggestion = async (prompt: string, context: { cwd: string, os: string }): Promise<string> => {
    const systemPrompt = `You are an expert in shell commands. Based on the user's prompt and their environment, suggest a single, concise shell command.
    Only output the command itself, with no explanation, decoration, or code blocks.
    
    Environment:
    - OS: ${context.os}
    - Current Directory: ${context.cwd}`;

    try {
        const response = await fetch(OLLAMA_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: "llama3", // Make sure you have this model installed in Ollama
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: prompt }
                ],
                stream: false,
                temperature: 0.0,
            }),
        });

        if (!response.ok) {
            throw new Error(`Ollama API request failed with status ${response.status}`);
        }

        const data = await response.json();
        const suggestion = data.choices[0]?.message?.content.trim();
        
        if (!suggestion) {
            return "echo 'No suggestion found.'";
        }

        return suggestion;

    } catch (error) {
        console.error('Error getting command suggestion:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return `echo 'Error: ${errorMessage.replace(/'/g, "''")}'`;
    }
};
