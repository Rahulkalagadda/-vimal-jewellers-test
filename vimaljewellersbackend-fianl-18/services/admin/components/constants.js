// Access environment variables injected by AdminJS config
const adminEnv = (typeof window !== 'undefined' && window.AdminJS && window.AdminJS.env) || {};

// Fallback to localhost if env vars are missing (Resilient Fix)
export const serverUrlApi = adminEnv.REACT_APP_API_URL || process.env.REACT_APP_API_URL || "https://backend.vimaljewellers.com/api/";
if (!serverUrlApi) console.error("REACT_APP_API_URL is missing! Check AdminJS config env/window.AdminJS.env");

export const serverUrlImage = adminEnv.REACT_APP_BACKEND_URL
    ? `${adminEnv.REACT_APP_BACKEND_URL}/images/`
    : (process.env.REACT_APP_BACKEND_URL ? `${process.env.REACT_APP_BACKEND_URL}/images/` : "https://backend.vimaljewellers.com/images/");
if (!serverUrlImage) console.error("REACT_APP_BACKEND_URL is missing! Check AdminJS config env/window.AdminJS.env");
