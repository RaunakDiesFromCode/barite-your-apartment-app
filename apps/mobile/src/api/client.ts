import * as SecureStore from 'expo-secure-store';

const API_BASE_URL = 'http://192.168.29.115:3000';

export async function api<T>(path: string, options: RequestInit = {}) {
  const token = await SecureStore.getItemAsync('token');

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (!res.ok) {
    throw new Error('API error');
  }

  return res.json() as Promise<T>;
}
