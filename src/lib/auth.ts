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

export async function updateProfile(payload: { username?: string; password?: string }) {
  const res = await api.put('/user', payload);
  return res.data.user;
}

export async function uploadAvatar(file: File) {
  const form = new FormData();
  form.append('avatar', file);
  const res = await api.post('/user/avatar', form, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return res.data.user;
}

export async function removeAvatar() {
  const res = await api.delete('/user/avatar');
  return res.data.user;
}
