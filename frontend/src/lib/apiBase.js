// Empty string in production builds makes requests relative, so nginx can proxy /api to the backend.
export const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:5000";
