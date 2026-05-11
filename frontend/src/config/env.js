const fallbackApiUrl = 'https://chat-vrjv.onrender.com';
const fallbackSocketUrl = 'https://chat-vrjv.onrender.com';

const normalizeBaseUrl = (value, fallback) => {
    const baseUrl = value?.trim();
    return baseUrl ? baseUrl.replace(/\/$/, '') : fallback;
};

export const API_URL = normalizeBaseUrl(import.meta.env.VITE_API_URL, fallbackApiUrl);
export const SOCKET_URL = normalizeBaseUrl(import.meta.env.VITE_SOCKET_URL, fallbackSocketUrl);
