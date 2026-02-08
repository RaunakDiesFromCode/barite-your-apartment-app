const API_BASE_URL = "http://192.168.29.115:3000";

export async function api<T>(path: string, options?: RequestInit): Promise<T> {
    const res = await fetch(`${API_BASE_URL}${path}`, {
        headers: {
            "Content-Type": "application/json",
        },
        ...options,
    });

    if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "API error");
    }

    return res.json();
}
