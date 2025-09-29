import { useState } from 'react';
import { MovieCard } from './MovieCard';
import { motion } from 'framer-motion';
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
  const [page, setPage] = useState(1);
  const pageSize = 20;
  const totalPages = Math.ceil(movies.length / pageSize);
  const paginatedMovies = movies.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="mb-12">
<<<<<<< HEAD
      <div className="mb-6" style={{ marginLeft: '40px' }}>
        <h2 className="text-2xl font-bold">{title}</h2>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8 justify-items-center mx-auto" style={{ marginLeft: '40px' }}>
        {paginatedMovies.map((movie, index) => (
=======
      <div className="flex items-center mb-6">
        <Flame className="w-6 h-6 text-pink-500 mr-2" />
        <h2 className="text-2xl font-bold text-white">{title}</h2>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 justify-items-center mx-auto px-4">
        {movies.map((movie, index) => (
>>>>>>> 9957b5c8b3ad3f2268de3286ee9eae86e599e35f
          <motion.div
            key={movie.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="w-full max-w-[170px]"
          >
            <MovieCard 
              movie={movie} 
              size="small" 
              onClick={onMovieClick}
            />
          </motion.div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center mt-8 gap-2">
          <button
            className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            Previous
          </button>
          <span className="px-3 py-1">Page {page} of {totalPages}</span>
          <button
            className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
