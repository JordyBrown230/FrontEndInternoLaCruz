export async function fetchDelete(url, data) {
    try {
        const response = await fetch(url + data, {
            method: 'DELETE',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Network response was not ok: ${errorData.message || 'Unknown error'}`);
        }
        
        const json = await response.json();
        return json;

    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
}