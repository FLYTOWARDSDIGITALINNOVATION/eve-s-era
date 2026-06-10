const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
const API_BASE_URL = isLocal 
  ? "http://localhost:5011" 
  : `${window.location.protocol}//${window.location.hostname}:${window.location.port}/api`;

export default API_BASE_URL;
