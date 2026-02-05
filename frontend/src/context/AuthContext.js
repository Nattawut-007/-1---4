import React, { createContext, useState, useEffect } from 'react';
import * as storage from '../utils/storage';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadUser = async () => {
            const token = await storage.getItem('token');
            if (token) {
                try {
                    const response = await api.get('/auth/me');
                    setUser(response.data);
                } catch (error) {
                    await storage.deleteItem('token');
                    setUser(null);
                }
            }
            setLoading(false);
        };
        loadUser();
    }, []);

    const login = async (username, password) => {
        try {
            const response = await api.post('/auth/login', { username, password });
            const { token, user } = response.data;
            await storage.setItem('token', token);
            setUser(user);
        } catch (error) {
            throw error;
        }
    };

    const register = async (username, password, role) => {
        try {
            const response = await api.post('/auth/register', { username, password, role });
            const { token, user } = response.data;
            await storage.setItem('token', token);
            setUser(user);
        } catch (error) {
            throw error;
        }
    }

    const logout = async () => {
        await storage.deleteItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
