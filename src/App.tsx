import { useState, useMemo } from 'react';
import { Button } from './components/ui/button';
import { Header } from './components/Header';
import { MovieCarousel } from './components/MovieCarousel';
import { GenreFilter } from './components/GenreFilter';
import { MovieGrid } from './components/MovieGrid';
import { MovieModal } from './components/MovieModal';
import { Footer } from './components/Footer';
import { motion } from 'motion/react';

// Mock movie data
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

export default function App() {
  const [currentView, setCurrentView] = useState<'landing' | 'browse'>('landing');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filter movies based on search and genre
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

  if (currentView === 'landing') {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <Header onSearch={setSearchQuery} />
        
        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 py-12 lg:px-8">
          {/* CTA Button */}
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Button 
                size="lg" 
                onClick={() => setCurrentView('browse')}
                className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
              >
                View Full Site →
              </Button>
            </motion.div>
          </div>
          
          {/* About Section */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-3xl font-bold mb-6">ABOUT GoWatch</h2>
            <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
              <p>
                Welcome to GoWatch, your ultimate destination for streaming the latest movies and TV series online. 
                Our platform offers an extensive library of entertainment content spanning all genres, from blockbuster 
                action films to heartwarming romantic comedies, thought-provoking dramas, and everything in between.
              </p>
              <p>
                At GoWatch, we believe that great entertainment should be accessible to everyone. That's why we've 
                created a user-friendly platform that makes it easy to discover new favorites and revisit beloved 
                classics. Our advanced recommendation system learns your preferences to suggest content you'll love, 
                while our intuitive search and filtering options help you find exactly what you're looking for.
              </p>
              <p>
                Whether you're in the mood for a thrilling adventure, a laugh-out-loud comedy, or an emotional drama, 
                GoWatch has something for every taste and occasion. Join millions of satisfied viewers who have made 
                GoWatch their go-to streaming destination. Start your cinematic journey today and discover why we're 
                the preferred choice for movie enthusiasts worldwide.
              </p>
            </div>
          </motion.section>
        </main>
        
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header onSearch={setSearchQuery} showNavigation />
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 lg:px-8">
        {/* Featured Movie Carousel */}
        <MovieCarousel 
          movies={mockMovies.slice(0, 5)} 
          onMovieClick={handleMovieClick}
        />
        
        {/* Genre Filter */}
        <GenreFilter 
          genres={allGenres}
          selectedGenres={selectedGenres}
          onGenreToggle={handleGenreToggle}
        />
        
        {/* Movie Grid */}
        <MovieGrid 
          title="Recommendations"
          movies={filteredMovies}
          onMovieClick={handleMovieClick}
        />
      </main>
      
      {/* Movie Modal */}
      <MovieModal 
        movie={selectedMovie}
        isOpen={isModalOpen}
        onClose={closeModal}
      />
      
      <Footer />
    </div>
  );
}