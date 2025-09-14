import axios from 'axios';

// Create axios instance with base URL
const api = axios.create({
    baseURL: 'https://gen-ai-coupon-system.onrender.com',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

// Add request interceptor to handle CORS
api.interceptors.request.use((config) => {
    config.headers['Origin'] = window.location.origin;
    return config;
});

export default api;