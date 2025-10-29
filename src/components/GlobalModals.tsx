import React, { useEffect, useState } from 'react';
import { Toaster, toast } from 'sonner';
import { AuthModal } from './AuthModal';
import { WatchlistModal } from './WatchlistModal';
import { getWatchlist, addToWatchlist, removeFromWatchlist } from '../lib/watchlist';
import { setAuthToken } from '../lib/api';

export default function GlobalModals() {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isWatchlistOpen, setIsWatchlistOpen] = useState(false);
  const [authMessage, setAuthMessage] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [watchlist, setWatchlist] = useState<any[]>([]);
  const [toastState, setToastState] = useState<{ message: string; type?: 'success' | 'error' | 'info' } | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('gowatch_user');
      if (raw) {
        const u = JSON.parse(raw);
        setCurrentUser(u);
        try { const t = localStorage.getItem('gowatch_token'); if (t) setAuthToken(t); } catch {}
        (async () => {
          try {
            const wl = await getWatchlist();
            setWatchlist(wl || []);
          } catch (err) {
          }
        })();
      }
    } catch {}

    const onOpenAuth = (e?: any) => {
      const msg = e?.detail?.message || null;
      setAuthMessage(msg);
      setIsAuthOpen(true);
    };

    const onOpenWatchlist = () => {
      // check persisted user at the time of opening (avoid stale closure over currentUser)
      try {
        const raw = localStorage.getItem('gowatch_user');
        if (raw) {
          setIsWatchlistOpen(true);
          return;
        }
      } catch {}

      // not signed in -> open auth modal with instructive message
      setAuthMessage('Please Login in or Create an Account to open watchlist.');
      setIsAuthOpen(true);
    };

    const onLogin = async (e: any) => {
      const user = e?.detail;
      if (!user) return;
      setCurrentUser(user);
      try { const t = localStorage.getItem('gowatch_token'); if (t) setAuthToken(t); } catch {}
      try {
            const wl = await getWatchlist();
            setWatchlist(wl || []);
      } catch (err) {
        console.warn('GlobalModals: failed to load watchlist after login', err);
      }

      try {
        const pending = JSON.parse(localStorage.getItem('gowatch_pending_save') || 'null');
        if (pending) {
            try {
            const r = await addToWatchlist({ id: pending.id, title: pending.title, poster: pending.image });
            const newItem = r && r.item ? r.item : null;
            if (newItem) {
              setWatchlist(prev => [newItem, ...(prev || []).filter(i => String(i.movieId) !== String(newItem.movieId))]);
            } else {
              const refreshed = await getWatchlist();
              setWatchlist(refreshed || []);
            }
            try { setToastState({ message: 'Saved pending movie to watchlist', type: 'success' }); } catch {}
          } catch (err) {
            console.warn('GlobalModals: pending save failed', err);
            try { setToastState({ message: 'Failed to save pending movie', type: 'error' }); } catch {}
          } finally {
            localStorage.removeItem('gowatch_pending_save');
          }
        }
      } catch {}
    };

    const onLogout = () => {
      setCurrentUser(null);
      setWatchlist([]);
      setIsAuthOpen(false);
      setIsWatchlistOpen(false);
      setAuthMessage(null);
      try { localStorage.removeItem('gowatch_user'); } catch {}
      try { localStorage.removeItem('gowatch_token'); } catch {}
      try { setAuthToken(null); } catch {}
    };

    window.addEventListener('gowatch:openAuth', onOpenAuth as EventListener);
    window.addEventListener('gowatch:openWatchlist', onOpenWatchlist as EventListener);
    window.addEventListener('gowatch:login', onLogin as EventListener);
    window.addEventListener('gowatch:logout', onLogout as EventListener);

    return () => {
      window.removeEventListener('gowatch:openAuth', onOpenAuth as EventListener);
      window.removeEventListener('gowatch:openWatchlist', onOpenWatchlist as EventListener);
      window.removeEventListener('gowatch:login', onLogin as EventListener);
      window.removeEventListener('gowatch:logout', onLogout as EventListener);
    };
  }, []);

  useEffect(() => {
    const onToast = (e: any) => {
      const d = e?.detail;
      if (!d || !d.message) return;
      setToastState({ message: d.message, type: d.type });
      try {
        const kind = (d.type || 'success') as 'success' | 'error' | 'info';
        // @ts-ignore
        toast[kind] ? (toast as any)[kind](d.message) : toast(d.message);
      } catch {
        toast(d.message);
      }
      setTimeout(() => setToastState(null), 3500);
    };
    window.addEventListener('gowatch:toast', onToast as EventListener);
    return () => window.removeEventListener('gowatch:toast', onToast as EventListener);
  }, []);

  useEffect(() => {
    (async () => {
      if (!currentUser) return;
      try {
        const wl = await getWatchlist();
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
      const r = await removeFromWatchlist(movieId);
      if (r && (r.deleted === undefined || r.deleted >= 0)) {
        setWatchlist(prev => (prev || []).filter(i => String(i.movieId) !== String(movieId)));
      } else {
        const wl = await getWatchlist();
        setWatchlist(wl || []);
      }
  try { setToastState({ message: 'Removed from watchlist', type: 'info' }); } catch {}
    } catch (err) {
      console.warn('GlobalModals: remove failed', err);
  try { setToastState({ message: 'Failed to remove from watchlist', type: 'error' }); } catch {}
    }
  };

  return (
    <>
      {isAuthOpen && (
        <AuthModal
          isOpen={isAuthOpen}
          onClose={() => {
            closeAuth();
            setAuthMessage(null);
          }}
          onLoginSuccess={async (user: any) => {
            try { localStorage.setItem('gowatch_user', JSON.stringify(user)); } catch {}
            window.dispatchEvent(new CustomEvent('gowatch:login', { detail: user }));
            setIsAuthOpen(false);
            setAuthMessage(null);
          }}
          message={authMessage}
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
      {/* Simple toast */}
      {toastState && (
        <div className={`fixed bottom-6 right-6 z-50 px-4 py-2 rounded shadow-lg text-white ${toastState.type === 'error' ? 'bg-red-600' : 'bg-green-600'}`}>
          {toastState.message}
        </div>
      )}
      <Toaster richColors position="bottom-right" />
    </>
  );
}
