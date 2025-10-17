import React, { useState, useMemo, useEffect } from 'react';
import axios from 'axios';
import { Header } from './Header';
import { MovieCarousel } from './MovieCarousel';
import { GenreFilter } from './GenreFilter';
import { MovieGrid } from './MovieGrid';
import { MovieModal } from './MovieModal';
import { Footer } from './Footer';


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
  const [movies, setMovies] = useState<Movie[]>([]);

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

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#EFE4F4' }}>
      <Header onSearch={setSearchQuery} showNavigation />
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
        />
      </main>
      <MovieModal 
        movie={selectedMovie}
        isOpen={isModalOpen}
        onClose={closeModal}
      />
      {filteredMovies.length === 0 ? (
        <Footer fixed />
      ) : (
        <Footer />
      )}
    </div>
  );
};

export default MainPage;