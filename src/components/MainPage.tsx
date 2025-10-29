import React, { useState, useMemo, useEffect } from 'react';
import axios from 'axios';
import { Header } from './Header';
import { MovieCarousel } from './MovieCarousel';
import { GenreFilter } from './GenreFilter';
import { MovieGrid } from './MovieGrid';
import { MovieModal } from './MovieModal';
import { Footer } from './Footer';
import { ensureDemoUser, getWatchlist, addToWatchlist } from '../lib/watchlist';
import GlobalModals from './GlobalModals';


const genreMap: { [id: number]: string } = {
  28: 'Action',
  12: 'Adventure',
  16: 'Animation',
  35: 'Comedy',
  80: 'Crime',
  99: 'Documentary',
  18: 'Drama',
  10751: 'Family',
  14: 'Fantasy',
  36: 'History',
  27: 'Horror',
  10402: 'Music',
  9648: 'Mystery',
  10749: 'Romance',
  878: 'Sci-Fi',
  10770: 'TV Movie',
  53: 'Thriller',
  10752: 'War',
  37: 'Western',
};

const allGenres = Array.from(new Set(Object.values(genreMap)));

interface Movie {
  id: string;
  title: string;
  year: number;
  rating: number;
  genre: string[];
  image: string;
  description?: string;
}

interface MainPageProps {
  initialSearchQuery?: string;
}

const MainPage: React.FC<MainPageProps> = ({ initialSearchQuery = '' }) => {
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isWatchlistOpen, setIsWatchlistOpen] = useState(false);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [watchlist, setWatchlist] = useState<any[]>([]);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMessage, setAuthMessage] = useState<string | null>(null);
  const [pendingSave, setPendingSave] = useState<Movie | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('gowatch_user');
      if (raw) {
        const user = JSON.parse(raw);
        setCurrentUser(user);
        (async () => {
          try {
            const wl = await getWatchlist(user.id);
            setWatchlist(wl || []);
          } catch (err) {
            console.warn('could not load watchlist on restore', err);
          }
        })();
      }
    } catch (err) {
      // ignore
    }

    const onLogin = (e: any) => {
      const user = e?.detail;
      if (user) {
        setCurrentUser(user);
        (async () => {
      try {
        const wl = await getWatchlist(user.id);
        setWatchlist(wl || []);
            // if there was a pending save, complete it now
            // check pending save from state or localStorage
            let p = pendingSave;
            if (!p) {
              try { p = JSON.parse(localStorage.getItem('gowatch_pending_save') || 'null'); } catch { p = null; }
            }
                if (p) {
              try {
                await addToWatchlist(user.id, { id: p.id, title: p.title, poster: p.image });
                const refreshed = await getWatchlist(user.id);
                setWatchlist(refreshed || []);
              } catch (err) {
                console.warn('pending save failed after login', err);
              } finally {
                setPendingSave(null);
                try { localStorage.removeItem('gowatch_pending_save'); } catch {}
              }
            }
          } catch (err) {
            console.warn('could not load watchlist after login', err);
          }
        })();
      }
    };
    window.addEventListener('gowatch:login', onLogin as EventListener);
    const onOpenAuth = () => setIsAuthOpen(true);
    window.addEventListener('gowatch:openAuth', onOpenAuth as EventListener);

    // handle save requests from MovieModal or other components
    const onSaveMovie = async (e: any) => {
      const movie: Movie | undefined = e?.detail;
      if (!movie) return;
      if (!currentUser) {
  // remember the requested movie and open auth modal
        setPendingSave(movie);
        try { localStorage.setItem('gowatch_pending_save', JSON.stringify(movie)); } catch {}
        setAuthMessage('Please sign in or create an account to save this movie to your watchlist.');
        setIsAuthOpen(true);
        return;
      }
      try {
        await addToWatchlist(currentUser.id, { id: movie.id, title: movie.title, poster: movie.image });
        const wl = await getWatchlist(currentUser.id);
        setWatchlist(wl || []);
        try { window.dispatchEvent(new CustomEvent('gowatch:toast', { detail: { message: 'Saved to watchlist', type: 'success' } })); } catch {}
      } catch (err) {
        console.warn('save movie failed', err);
        try { window.dispatchEvent(new CustomEvent('gowatch:toast', { detail: { message: 'Failed to save movie', type: 'error' } })); } catch {}
      }
    };
    window.addEventListener('gowatch:saveMovie', onSaveMovie as EventListener);

    return () => {
      window.removeEventListener('gowatch:login', onLogin as EventListener);
      window.removeEventListener('gowatch:openAuth', onOpenAuth as EventListener);
      window.removeEventListener('gowatch:saveMovie', onSaveMovie as EventListener);
    };
  }, []);

  useEffect(() => {
    const TMDB_API_KEY = '6ca1b09b9b4d7b85f93570a942e26c09';
    axios.get(`https://api.themoviedb.org/3/trending/movie/week?api_key=${TMDB_API_KEY}`)
      .then(res => {
  const mapped = res.data.results.map((m: any) => ({
          id: m.id,
          title: m.title,
          year: m.release_date ? Number(m.release_date.slice(0, 4)) : 0,
          rating: m.vote_average,
          genre: m.genre_ids.map((id: number) => genreMap[id] || 'Unknown'),
          image: m.poster_path ? `https://image.tmdb.org/t/p/w500${m.poster_path}` : '',
          description: m.overview
        }));
        setMovies(mapped);
      });

    (async () => {
      try {
      } catch (err) {
        console.warn('watchlist init failed', err);
      }
    })();
  }, []);

  const filteredMovies = useMemo(() => {
    return movies.filter(movie => {
      const matchesGenre = selectedGenres.length === 0 || 
        selectedGenres.some(genre => movie.genre.includes(genre));
      const matchesSearch = searchQuery.trim() === '' || movie.title.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesGenre && matchesSearch;
    });
  }, [selectedGenres, movies, searchQuery]);

  const handleGenreToggle = (genre: string) => {
    setSelectedGenres(prev => 
      prev.includes(genre) 
        ? prev.filter(g => g !== genre)
        : [...prev, genre]
    );
  };

  const handleMovieClick = (movie: Movie) => {
    setSelectedMovie(movie);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedMovie(null);
  };

  const openWatchlist = () => {
    try { window.dispatchEvent(new CustomEvent('gowatch:openWatchlist')); } catch { /* no-op */ }
  };

  const closeWatchlist = () => {
    try { window.dispatchEvent(new CustomEvent('gowatch:closeWatchlist')); } catch { /* no-op */ }
  };

  const openAuth = () => {
    try { window.dispatchEvent(new CustomEvent('gowatch:openAuth')); } catch { /* no-op */ }
  };

  const handleLogout = () => {
    try { localStorage.removeItem('gowatch_user'); } catch {}
    setCurrentUser(null);
    setWatchlist([]);
    try { window.dispatchEvent(new CustomEvent('gowatch:logout')); } catch {}
  };

  const closeAuth = () => {
    try { window.dispatchEvent(new CustomEvent('gowatch:closeAuth')); } catch { /* no-op */ }
  };

  const handleCloseAuth = () => {
    setIsAuthOpen(false);
    setAuthMessage(null);
  };

  const handleRemoveFromWatchlist = async (movieId: string) => {
    if (!currentUser) return;
    try {
      const { removeFromWatchlist } = await import('../lib/watchlist');
      await removeFromWatchlist(currentUser.id, movieId);
      const wl = await getWatchlist(currentUser.id);
      setWatchlist(wl || []);
    } catch (err) {
      console.warn('remove failed', err);
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#EFE4F4' }}>
  <Header onSearch={setSearchQuery} showNavigation onOpenWatchlist={openWatchlist} onOpenAuth={openAuth} watchlistCount={watchlist.length} currentUser={currentUser} onLogout={handleLogout} />
      <main className="max-w-7xl mx-auto px-4 py-8 lg:px-8 pb-32 mt-40">
        <br />
        <br />
        <br />
          {searchQuery.trim() === '' && (
            <MovieCarousel 
              movies={
                [...movies]
                  .filter(m => m.year && !isNaN(Number(m.year)))
                  .sort((a, b) => {
                    const yearDiff = Number(b.year) - Number(a.year);
                    if (yearDiff !== 0) return yearDiff;
                    return b.rating - a.rating;
                  })
                  .slice(0, 5)
              }
              onMovieClick={handleMovieClick}
            />
          )}
          <br />
        <GenreFilter 
          genres={allGenres}
          selectedGenres={selectedGenres}
          onGenreToggle={handleGenreToggle}
        />
        <MovieGrid 
          title="Results"
          movies={filteredMovies}
          onMovieClick={handleMovieClick}
          demoUserId={currentUser?.id ?? null}
          watchlistIds={watchlist.map((i) => i.movieId)}
        />
      </main>
      <MovieModal 
        movie={selectedMovie}
        isOpen={isModalOpen}
        onClose={closeModal}
        isSaved={selectedMovie ? watchlist.map((i) => String(i.movieId)).includes(String(selectedMovie.id)) : false}
      />
      <GlobalModals />
      {filteredMovies.length === 0 ? (
        <Footer fixed />
      ) : (
        <Footer />
      )}
    </div>
  );
};

export default MainPage;