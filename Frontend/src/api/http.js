import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const http = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000
});

export function normalizeApiError(err) {
  const data = err?.response?.data;
  if (data && typeof data === 'object') return data;
  return { success: false, message: err?.message || 'Request failed', errors: [] };
}
