import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { Button } from './ui/button';
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

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const getVisibleMovies = () => {
    const prevIndex = (currentIndex - 1 + movies.length) % movies.length;
    const nextIndex = (currentIndex + 1) % movies.length;
    
    return {
      prev: movies[prevIndex],
      current: movies[currentIndex],
      next: movies[nextIndex]
    };
  };

  const visibleMovies = getVisibleMovies();

  if (!visibleMovies.current) return null;

  return (
  <div className="relative w-full mb-12 py-8">
      <div className="relative flex items-center justify-center max-w-6xl mx-auto">
        {/* Left Navigation Arrow */}
        <Button
          variant="ghost"
          size="icon"
          onClick={prevSlide}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-14 h-14 rounded-full bg-[#232b3e] hover:bg-[#232b3e]/80 text-white border-0 shadow-lg"
        >
          <ChevronLeft className="w-7 h-7" />
        </Button>

        {/* Carousel Container */}
        <div className="relative flex items-center justify-center w-full max-w-4xl overflow-visible">
          {/* Previous Movie */}
          <div className="relative w-[340px] h-[180px] mx-2 opacity-60">
            <div className="w-full h-full bg-gray-500 rounded-xl overflow-hidden flex items-end">
              <ImageWithFallback
                src={visibleMovies.prev.image}
                alt={visibleMovies.prev.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Current Movie */}
          <AnimatePresence mode="wait">
            <motion.div
              key={visibleMovies.current.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
              className="relative w-[540px] h-[220px] mx-2 z-10 cursor-pointer"
              onClick={() => onMovieClick?.(visibleMovies.current)}
            >
              <div className="w-full h-full bg-black rounded-xl overflow-hidden shadow-xl flex items-end">
                <ImageWithFallback
                  src={visibleMovies.current.image}
                  alt={visibleMovies.current.title}
                  className="w-full h-full object-cover"
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-black rounded-xl" />
                {/* Movie Info */}
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="text-xl font-semibold mb-1">
                    {visibleMovies.current.title}
                  </h3>
                  <div className="flex items-center space-x-2 text-xs">
                    <Star className="w-3 h-3 fill-white text-white" />
                    <span>{visibleMovies.current.rating}</span>
                    <span>|</span>
                    <span>{visibleMovies.current.year}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Next Movie */}
          <div className="relative w-[340px] h-[180px] mx-2 opacity-60">
            <div className="w-full h-full bg-gray-500 rounded-xl overflow-hidden flex items-end">
              <ImageWithFallback
                src={visibleMovies.next.image}
                alt={visibleMovies.next.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Right Navigation Arrow */}
        <Button
          variant="ghost"
          size="icon"
          onClick={nextSlide}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-14 h-14 rounded-full bg-[#232b3e] hover:bg-[#232b3e]/80 text-white border-0 shadow-lg"
        >
          <ChevronRight className="w-7 h-7" />
        </Button>
      </div>

      {/* Dot Indicators */}
      <div className="flex justify-center space-x-4 mt-8">
        {movies.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === currentIndex 
                ? 'bg-white w-8' 
                : 'bg-gray-500 hover:bg-gray-400 w-2'
            }`}
          />
        ))}
      </div>
    </div>
  );
}