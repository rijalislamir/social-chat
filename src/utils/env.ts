export const getBackendURL = () => import.meta.env.DEV ? 'http://localhost:5000' : import.meta.env.VITE_BACKEND_URL
