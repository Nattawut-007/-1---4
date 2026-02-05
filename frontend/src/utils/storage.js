import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const isWeb = Platform.OS === 'web';

export const setItem = async (key, value) => {
    if (isWeb) {
        try {
            localStorage.setItem(key, value);
        } catch (e) {
            console.error('Local storage is not supported', e);
        }
    } else {
        await SecureStore.setItemAsync(key, value);
    }
};

export const getItem = async (key) => {
    if (isWeb) {
        if (typeof localStorage !== 'undefined') {
            return localStorage.getItem(key);
        }
        return null;
    } else {
        return await SecureStore.getItemAsync(key);
    }
};

export const deleteItem = async (key) => {
    if (isWeb) {
        if (typeof localStorage !== 'undefined') {
            localStorage.removeItem(key);
        }
    } else {
        await SecureStore.deleteItemAsync(key);
    }
};
