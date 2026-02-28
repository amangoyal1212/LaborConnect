import { createContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../services/api';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Re-hydrate user from local storage
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const token = localStorage.getItem('token');

        if (storedUser && token) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    /**
     * Login with either phone OR email + password.
     * Detects whether the identifier is an email (contains '@') and sends
     * the appropriate field in the request body.
     */
    const login = async (identifier, password) => {
        try {
            const payload = { password };
            if (identifier.includes('@')) {
                payload.email = identifier.trim().toLowerCase();
            } else {
                payload.phone = identifier.trim();
            }
            const response = await api.post('/auth/login', payload);
            const { token, ...userData } = response.data;

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(userData));
            setUser(userData);
            toast.success('Login Successful!');
            return true;
        } catch (error) {
            toast.error(error.response?.data?.message || 'Login failed');
            return false;
        }
    };

    const register = async (userData) => {
        try {
            const response = await api.post('/auth/register', userData);
            const { token, ...newUserData } = response.data;

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(newUserData));
            setUser(newUserData);
            toast.success('Registration Successful!');
            return true;
        } catch (error) {
            console.error('Registration Error Details:', error.response || error);
            toast.error(error.response?.data?.message || 'Registration failed');
            return false;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        toast.info('Logged out successfully');
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
