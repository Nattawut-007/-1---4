import axios from 'axios';
import * as storage from '../utils/storage';
import { Platform } from 'react-native';

// Use the computer's Wi-Fi IP address so physical mobile devices can connect
const BASE_URL = 'http://172.29.61.45:3000/api';

const api = axios.create({
    baseURL: BASE_URL,
});

api.interceptors.request.use(async (config) => {
    const token = await storage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;
