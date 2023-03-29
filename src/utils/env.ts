export const getBackendURL = () =>
  import.meta.env.DEV
    ? import.meta.env.VITE_LOCAL_BACKEND_URL
    : import.meta.env.VITE_BACKEND_URL;
