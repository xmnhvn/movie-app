import { api, setAuthToken } from './api';

export async function signup(username: string, password: string) {
  const res = await api.post('/auth/signup', { username, password });
  const { user, token } = res.data;
  if (token) {
    try { localStorage.setItem('gowatch_token', token); } catch {}
    setAuthToken(token);
  }
  return user;
}

export async function login(username: string, password: string) {
  const res = await api.post('/auth/login', { username, password });
  const { user, token } = res.data;
  if (token) {
    try { localStorage.setItem('gowatch_token', token); } catch {}
    setAuthToken(token);
  }
  return user;
}

export async function createOrGetUser(username: string) {
  const res = await api.post('/users', { username });
  return res.data.user;
}
