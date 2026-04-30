const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
const API_BASE_URL = import.meta.env.VITE_API_URL || (isLocal ? "http://localhost:5000" : `http://${window.location.hostname}:5000`);

export default API_BASE_URL;
