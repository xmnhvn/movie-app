import React, { useState, useMemo, useEffect } from 'react';
import { Header } from './Header';
import { MovieCarousel } from './MovieCarousel';
import { GenreFilter } from './GenreFilter';
import { MovieGrid } from './MovieGrid';
import { MovieModal } from './MovieModal';
import { Footer } from './Footer';


const allGenres = ['Action', 'Comedy', 'Drama', 'Sci-Fi', 'Crime', 'Thriller', 'Romance', 'Animation', 'Family'];

interface Movie {
  id: string;
  title: string;
  year: number;
  rating: number;
  genre: string[];
  image: string;
  description?: string;
}

const MainPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('Avengers');
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [movies, setMovies] = useState<Movie[]>([]);
  const [page, setPage] = useState(1);
  useEffect(() => {
    if (!searchQuery) {
      setMovies([]);
      return;
    }
    fetch(`https://www.omdbapi.com/?apikey=8c18d7f8&s=${encodeURIComponent(searchQuery)}&page=${page}`)
      .then(res => res.json())
      .then(data => {
        if (data.Search) {
          Promise.all(
            data.Search.map((item: any) =>
              fetch(`https://www.omdbapi.com/?apikey=8c18d7f8&i=${item.imdbID}`)
                .then(res => res.json())
            )
          ).then(results => {
            const mapped = results.map((m: any) => ({
              id: m.imdbID,
              title: m.Title,
              year: m.Year,
              rating: parseFloat(m.imdbRating),
              genre: m.Genre ? m.Genre.split(',').map((g: string) => g.trim()) : [],
              image: m.Poster,
              description: m.Plot
            }));
            setMovies(mapped);
          });
        } else {
          setMovies([]);
        }
      });
  }, [searchQuery, page]);

  const filteredMovies = useMemo(() => {
    return movies.filter(movie => {
      const matchesGenre = selectedGenres.length === 0 || 
        selectedGenres.some(genre => movie.genre.includes(genre));
      return matchesGenre;
    });
  }, [selectedGenres, movies]);

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
    <div className="min-h-screen bg-[#EFE4F4]">
      <Header onSearch={setSearchQuery} showNavigation />
      <main className="max-w-7xl mx-auto px-4 py-8 lg:px-8">
        <MovieCarousel 
          movies={
            [...movies]
              .filter(m => {
                const currentYear = new Date().getFullYear();
                return m.rating && !isNaN(m.rating) && m.year && Number(m.year) === currentYear;
              })
              .sort((a, b) => b.rating - a.rating)
          }
          onMovieClick={handleMovieClick}
        />
        <GenreFilter 
          genres={allGenres}
          selectedGenres={selectedGenres}
          onGenreToggle={handleGenreToggle}
        />

        <MovieGrid 
          title="Recommendations"
          movies={filteredMovies}
          onMovieClick={handleMovieClick}
        />
      </main>

      <MovieModal 
        movie={selectedMovie}
        isOpen={isModalOpen}
        onClose={closeModal}
      />
      <Footer />
    </div>
  );
};

export default MainPage;
