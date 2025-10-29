import axios from 'axios';

export const api = axios.create({ baseURL: '/api' });

export function setAuthToken(token: string | null) {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
}

// On module load, restore token from localStorage (so dev server + page reloads keep auth)
try {
  const t = localStorage.getItem('gowatch_token');
  if (t) setAuthToken(t);
} catch (e) {
  // ignore
}
