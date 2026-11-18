const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";

const API_BASE_URL = isLocal
  ? "http://127.0.0.1:5011"         // dev: direct to backend over IPv4 loopback
  : "https://eveseraclothing.com/api"; // live: through nginx proxy → backend

export default API_BASE_URL;
