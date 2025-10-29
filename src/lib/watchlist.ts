import { api } from './api';

export async function ensureDemoUser(username = 'demo') {
  const res = await api.post('/users', { username });
  return res.data.user;
}

export async function addToWatchlist(movie: any) {
  const res = await api.post('/watchlist', { movie });
  return res.data;
}

export async function removeFromWatchlist(movieId: string) {
  const res = await api.delete(`/watchlist/${encodeURIComponent(movieId)}`);
  return res.data;
}

export async function getWatchlist() {
  const res = await api.get(`/watchlist`);
  return res.data.watchlist;
}
