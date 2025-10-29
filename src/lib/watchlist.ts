import { api } from './api';

export async function ensureDemoUser(username = 'demo') {
  const res = await api.post('/users', { username });
  return res.data.user;
}

// Server expects the userId to be provided. Frontend callers should pass the
// authenticated user's id when calling these helpers.
export async function addToWatchlist(userId: string, movie: any) {
  const res = await api.post('/watchlist', { userId, movie });
  return res.data;
}

export async function removeFromWatchlist(userId: string, movieId: string) {
  const res = await api.delete(`/watchlist/${encodeURIComponent(userId)}/${encodeURIComponent(movieId)}`);
  return res.data;
}

export async function getWatchlist(userId: string) {
  const res = await api.get(`/watchlist/${encodeURIComponent(userId)}`);
  return res.data.watchlist;
}
