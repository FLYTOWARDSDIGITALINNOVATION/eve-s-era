const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";

const API_BASE_URL = isLocal
  ? "http://localhost:5011"         // dev: direct to backend
  : "https://eveseraclothing.com/api"; // live: through nginx proxy → backend

export default API_BASE_URL;
