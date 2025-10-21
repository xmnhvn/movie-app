import React, { useEffect, useState } from 'react';
import { AuthModal } from './AuthModal';
import { WatchlistModal } from './WatchlistModal';
import { getWatchlist, addToWatchlist, removeFromWatchlist } from '../lib/watchlist';

// Single, clean implementation of GlobalModals
export default function GlobalModals() {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isWatchlistOpen, setIsWatchlistOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [watchlist, setWatchlist] = useState<any[]>([]);

  useEffect(() => {
    // restore persisted user
    try {
      const raw = localStorage.getItem('gowatch_user');
      if (raw) {
        const u = JSON.parse(raw);
        setCurrentUser(u);
        (async () => {
          try {
            const wl = await getWatchlist(u.id);
            setWatchlist(wl || []);
          } catch (err) {
            // ignore
          }
        })();
      }
    } catch {}

    const onOpenAuth = () => setIsAuthOpen(true);
    const onOpenWatchlist = () => setIsWatchlistOpen(true);

    const onLogin = async (e: any) => {
      const user = e?.detail;
      if (!user) return;
      setCurrentUser(user);

      try {
        const wl = await getWatchlist(user.id);
        setWatchlist(wl || []);
      } catch (err) {
        console.warn('GlobalModals: failed to load watchlist after login', err);
      }

      // attempt pending save
      try {
        const pending = JSON.parse(localStorage.getItem('gowatch_pending_save') || 'null');
        if (pending) {
          try {
            await addToWatchlist(user.id, { id: pending.id, title: pending.title, poster: pending.image });
            const refreshed = await getWatchlist(user.id);
            setWatchlist(refreshed || []);
          } catch (err) {
            console.warn('GlobalModals: pending save failed', err);
          } finally {
            localStorage.removeItem('gowatch_pending_save');
          }
        }
      } catch {}
    };

    window.addEventListener('gowatch:openAuth', onOpenAuth as EventListener);
    window.addEventListener('gowatch:openWatchlist', onOpenWatchlist as EventListener);
    window.addEventListener('gowatch:login', onLogin as EventListener);

    return () => {
      window.removeEventListener('gowatch:openAuth', onOpenAuth as EventListener);
      window.removeEventListener('gowatch:openWatchlist', onOpenWatchlist as EventListener);
      window.removeEventListener('gowatch:login', onLogin as EventListener);
    };
  }, []);

  useEffect(() => {
    (async () => {
      if (!currentUser) return;
      try {
        const wl = await getWatchlist(currentUser.id);
        setWatchlist(wl || []);
      } catch (err) {
        console.warn('GlobalModals: failed loading watchlist', err);
      }
    })();
  }, [currentUser]);

  const closeAuth = () => setIsAuthOpen(false);
  const closeWatchlist = () => setIsWatchlistOpen(false);

  const handleRemove = async (movieId: string) => {
    if (!currentUser) return;
    try {
      await removeFromWatchlist(currentUser.id, movieId);
      const wl = await getWatchlist(currentUser.id);
      setWatchlist(wl || []);
    } catch (err) {
      console.warn('GlobalModals: remove failed', err);
    }
  };

  return (
    <>
      {isAuthOpen && (
        <AuthModal
          isOpen={isAuthOpen}
          onClose={closeAuth}
          onLoginSuccess={async (user: any) => {
            try { localStorage.setItem('gowatch_user', JSON.stringify(user)); } catch {}
            window.dispatchEvent(new CustomEvent('gowatch:login', { detail: user }));
            setIsAuthOpen(false);
          }}
        />
      )}

      {isWatchlistOpen && (
        <WatchlistModal
          isOpen={isWatchlistOpen}
          onClose={closeWatchlist}
          watchlist={watchlist}
          onRemove={handleRemove}
        />
      )}
    </>
  );
}
