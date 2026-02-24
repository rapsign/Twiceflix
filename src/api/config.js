export const API_BASE = import.meta.env.VITE_API_BASE;
export const API_KEY = import.meta.env.VITE_API_KEY;

export const defaultHeaders = {
  "Content-Type": "application/json",
  "x-api-key": import.meta.env.VITE_API_KEY,
};
