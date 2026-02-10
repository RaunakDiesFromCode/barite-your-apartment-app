import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'auth_token';

export function saveToken(token: string) {
    return SecureStore.setItemAsync(TOKEN_KEY, token);
}

export function getToken() {
    return SecureStore.getItemAsync(TOKEN_KEY);
}

export function clearToken() {
    return SecureStore.deleteItemAsync(TOKEN_KEY);
}
