const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";

export const REMOTE_API_BASE_URL = "https://eveseraclothing.com/api";

const API_BASE_URL = isLocal
  ? "http://127.0.0.1:5011"         // dev: direct to backend over IPv4 loopback
  : REMOTE_API_BASE_URL; // live: through nginx proxy → backend

export default API_BASE_URL;
