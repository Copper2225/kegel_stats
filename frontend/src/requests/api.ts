const backendURL = import.meta.env.VITE_BACKEND_URL;

export const api = {
    get: async (url: string) => {
        const response = await fetch(`${backendURL}${url}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.json();
    },

    post: async (url: string, body?: unknown) => {
        const response = await fetch(`${backendURL}${url}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: body !== undefined ? JSON.stringify(body) : undefined,
        });
        return response.json();
    },
};
