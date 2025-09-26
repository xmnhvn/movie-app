import { MovieCard } from './MovieCard';
import { motion } from 'motion/react';
import { Flame } from 'lucide-react';

interface Movie {
  id: string;
  title: string;
  year: number;
  rating: number;
  genre: string[];
  image: string;
  description?: string;
}

interface MovieGridProps {
  title: string;
  movies: Movie[];
  onMovieClick?: (movie: Movie) => void;
}

export function MovieGrid({ title, movies, onMovieClick }: MovieGridProps) {
  return (
    <div className="mb-12">
      <div className="flex items-center mb-6">
        <Flame className="w-6 h-6 text-pink-500 mr-2" />
        <h2 className="text-2xl font-bold">{title}</h2>
      </div>
      
  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8 justify-items-center mx-auto" style={{ marginLeft: '40px' }}>
        {movies.map((movie, index) => (
          <motion.div
            key={movie.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <MovieCard 
              movie={movie} 
              size="small" 
              onClick={onMovieClick}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
