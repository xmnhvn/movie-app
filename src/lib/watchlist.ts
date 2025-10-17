import axios from 'axios';

const api = axios.create({ baseURL: '/api' });

export async function ensureDemoUser(username = 'demo') {
  const res = await api.post('/users', { username });
  return res.data.user;
}

export async function addToWatchlist(userId: number, movie: any) {
  const res = await api.post('/watchlist', { userId, movie });
  return res.data;
}

export async function removeFromWatchlist(userId: number, movieId: string) {
  const res = await api.delete(`/watchlist/${userId}/${encodeURIComponent(movieId)}`);
  return res.data;
}

export async function getWatchlist(userId: number) {
  const res = await api.get(`/watchlist/${userId}`);
  return res.data.watchlist;
}
