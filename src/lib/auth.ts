import axios from 'axios';

const api = axios.create({ baseURL: '/api' });

export async function signup(username: string, password: string) {
  const res = await api.post('/auth/signup', { username, password });
  return res.data.user;
}

export async function login(username: string, password: string) {
  const res = await api.post('/auth/login', { username, password });
  return res.data.user;
}

export async function createOrGetUser(username: string) {
  const res = await api.post('/users', { username });
  return res.data.user;
}
