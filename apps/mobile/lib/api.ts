const API_URL = process.env.EXPO_PUBLIC_API_URL!;

export async function apiFetch(path: string, options: RequestInit = {}) {
    const res = await fetch(API_URL.replace(/\/$/, '') + path, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...(options.headers || {}),
        },
    });

    if (!res.ok) {
        throw new Error(await res.text());
    }

    return res.json();
}
