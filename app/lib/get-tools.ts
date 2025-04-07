
export async function getTools(): Promise<string> {
    const response = await fetch(`https://veyraxapp.com/get-tools`, {
    method: 'GET',
    headers: {
        'VEYRAX_API_KEY': process.env.VEYRAX_API_KEY || '',
        'Content-Type': 'application/json'
    }
    });

    const tools = await response.json();
    
    return JSON.stringify(tools);
}