'use server'

export async function generateImage(prompt: string): Promise<string> {
    try {
        const response = await fetch('http://localhost:5000/api/generate-image', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: prompt })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        return data.result;
    } catch (error) {
        console.error('Failed to generate image:', error);
        throw error;
    }
}
