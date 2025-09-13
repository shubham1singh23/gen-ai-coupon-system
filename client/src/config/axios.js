import axios from 'axios';

// Create axios instance with base URL
const api = axios.create({
    baseURL: 'https://gen-ai-coupon-form.vercel.app',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});

export default api;