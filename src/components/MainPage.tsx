import React, { useState, useMemo } from 'react';
import { Header } from './Header';
import { MovieCarousel } from './MovieCarousel';
import { GenreFilter } from './GenreFilter';
import { MovieGrid } from './MovieGrid';
import { MovieModal } from './MovieModal';
import { Footer } from './Footer';

const mockMovies = [
  {
    id: '1',
    title: 'The Dark Knight',
    year: 2008,
    rating: 9.0,
    genre: ['Action', 'Crime', 'Drama'],
    image: 'https://images.unsplash.com/photo-1739891251370-05b62a54697b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxhY3Rpb24lMjBtb3ZpZSUyMHBvc3RlcnxlbnwxfHx8fDE3NTcyOTA2ODF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
  },
  {
    id: '2',
    title: 'Inception',
    year: 2010,
    rating: 8.8,
    genre: ['Action', 'Sci-Fi', 'Thriller'],
    image: 'https://images.unsplash.com/photo-1631420480302-91ed05c98b8d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21lZHklMjBtb3ZpZSUyMHNjZW5lfGVufDF8fHx8MTc1NzMwMDIxOXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
  },
  {
    id: '3',
    title: 'The Shawshank Redemption',
    year: 1994,
    rating: 9.3,
    genre: ['Drama'],
    image: 'https://images.unsplash.com/photo-1647962982511-f120db3d63c8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkcmFtYSUyMG1vdmllJTIwc2NlbmV8ZW58MXx8fHwxNzU3MzAwMjE5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
  },
  {
    id: '4',
    title: 'Pulp Fiction',
    year: 1994,
    rating: 8.9,
    genre: ['Crime', 'Drama'],
    image: 'https://images.unsplash.com/photo-1712456298333-5747a9506a5d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob3Jyb3IlMjBtb3ZpZSUyMHBvc3RlcnxlbnwxfHx8fDE3NTcyMTkxMjl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
  },
  {
    id: '5',
    title: 'The Godfather',
    year: 1972,
    rating: 9.2,
    genre: ['Crime', 'Drama'],
    image: 'https://images.unsplash.com/photo-1524712245354-2c4e5e7121c0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHNlYXJjaHwxfHxtb3ZpZSUyMHRoZWF0ZXIlMjBjaW5lbWF8ZW58MXx8fHwxNzU3Mjc5Nzc3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
  },
  {
    id: '6',
    title: 'Forrest Gump',
    year: 1994,
    rating: 8.8,
    genre: ['Drama', 'Romance'],
    image: 'https://images.unsplash.com/photo-1647962982511-f120db3d63c8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkcmFtYSUyMG1vdmllJTIwc2NlbmV8ZW58MXx8fHwxNzU3MzAwMjE5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
  },
  {
    id: '7',
    title: 'The Matrix',
    year: 1999,
    rating: 8.7,
    genre: ['Action', 'Sci-Fi'],
    image: 'https://images.unsplash.com/photo-1739891251370-05b62a54697b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxhY3Rpb24lMjBtb3ZpZSUyMHBvc3RlcnxlbnwxfHx8fDE3NTcyOTA2ODF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
  },
  {
    id: '8',
    title: 'Goodfellas',
    year: 1990,
    rating: 8.7,
    genre: ['Crime', 'Drama'],
    image: 'https://images.unsplash.com/photo-1631420480302-91ed05c98b8d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21lZHklMjBtb3ZpZSUyMHNjZW5lfGVufDF8fHx8MTc1NzMwMDIxOXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
  },
  {
    id: '9',
    title: 'Fight Club',
    year: 1999,
    rating: 8.8,
    genre: ['Drama', 'Thriller'],
    image: 'https://images.unsplash.com/photo-1712456298333-5747a9506a5d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob3Jyb3IlMjBtb3ZpZSUyMHBvc3RlcnxlbnwxfHx8fDE3NTcyMTkxMjl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
  },
  {
    id: '10',
    title: 'The Lion King',
    year: 1994,
    rating: 8.5,
    genre: ['Animation', 'Family'],
    image: 'https://images.unsplash.com/photo-1524712245354-2c4e5e7121c0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHNlYXJjaHwxfHxtb3ZpZSUyMHRoZWF0ZXIlMjBjaW5lbWF8ZW58MXx8fHwxNzU3Mjc5Nzc3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
  }
];

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
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredMovies = useMemo(() => {
    return mockMovies.filter(movie => {
      const matchesSearch = movie.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesGenre = selectedGenres.length === 0 || 
        selectedGenres.some(genre => movie.genre.includes(genre));
      return matchesSearch && matchesGenre;
    });
  }, [searchQuery, selectedGenres]);

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
      <main className="max-w-7xl mx-auto px-4 py-8 lg:px-8">
        <MovieCarousel 
          movies={mockMovies.slice(0, 5)} 
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
