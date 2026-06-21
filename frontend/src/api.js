const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";

const API_BASE_URL = isLocal
  ? "http://localhost:5011"
  : "http://31.97.237.122:5011";

export default API_BASE_URL;
