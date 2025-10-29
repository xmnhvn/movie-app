import axios from 'axios';

const envBase = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_URL) || '';
const baseURL = envBase ? `${envBase.replace(/\/$/, '')}/api` : '/api';

export const api = axios.create({ baseURL });

export function setAuthToken(token: string | null) {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
}

try {
  const t = localStorage.getItem('gowatch_token');
  if (t) setAuthToken(t);
} catch (e) {
}

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err?.response?.status;
    if (status === 401) {
      try { localStorage.removeItem('gowatch_token'); } catch {}
      try { localStorage.removeItem('gowatch_user'); } catch {}
      try { setAuthToken(null); } catch {}
      try { window.dispatchEvent(new CustomEvent('gowatch:openAuth', { detail: { message: 'Session expired. Please sign in again.' } })); } catch {}
    }
    return Promise.reject(err);
  }
);
