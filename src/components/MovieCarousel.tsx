import { useState } from 'react';
import { ChevronLeft, ChevronRight, Star, Play, Info } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { motion, AnimatePresence } from 'motion/react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface Movie {
  id: string;
  title: string;
  year: number;
  rating: number;
  genre: string[];
  image: string;
  description?: string;
}

interface MovieCarouselProps {
  movies: Movie[];
  onMovieClick?: (movie: Movie) => void;
}

export function MovieCarousel({ movies, onMovieClick }: MovieCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % movies.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + movies.length) % movies.length);
  };

  const currentMovie = movies[currentIndex];

  if (!currentMovie) return null;

  return (
    <div className="relative max-w-4xl mx-auto mb-8">
      <div className="flex items-center justify-center space-x-4">
        {/* Previous Button */}
        <Button
          variant="ghost"
          size="lg"
          onClick={prevSlide}
          className="w-16 h-16 bg-gray-400 hover:bg-gray-500 text-white rounded-lg flex-shrink-0"
        >
          <ChevronLeft className="w-8 h-8" />
        </Button>

        {/* Main Movie Display */}
        <div className="relative flex-1 max-w-2xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentMovie.id}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.3 }}
              className="relative"
            >
              <div className="relative w-full h-80 bg-black rounded-lg overflow-hidden group cursor-pointer"
                   onClick={() => onMovieClick?.(currentMovie)}>
                <ImageWithFallback
                  src={currentMovie.image}
                  alt={currentMovie.title}
                  className="w-full h-full object-cover"
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                
                {/* Movie Info */}
                <div className="absolute bottom-4 left-4 right-4">
                  <h2 className="text-2xl font-bold text-white mb-2">{currentMovie.title}</h2>
                  <div className="flex items-center space-x-4 mb-3">
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-white">{currentMovie.rating}</span>
                    </div>
                    <span className="text-white">{currentMovie.year}</span>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                      <Play className="w-4 h-4 mr-2" />
                      Watch Now
                    </Button>
                    <Button size="sm" variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                      <Info className="w-4 h-4 mr-2" />
                      More Info
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Next Button */}
        <Button
          variant="ghost"
          size="lg"
          onClick={nextSlide}
          className="w-16 h-16 bg-gray-400 hover:bg-gray-500 text-white rounded-lg flex-shrink-0"
        >
          <ChevronRight className="w-8 h-8" />
        </Button>
      </div>

      {/* Dots Indicator */}
      <div className="flex justify-center space-x-2 mt-4">
        {movies.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-colors ${
              index === currentIndex ? 'bg-purple-600' : 'bg-gray-300'
            }`}
          />
        ))}
      </div>
    </div>
  );
}