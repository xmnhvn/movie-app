import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { motion } from "framer-motion";
import { ImageWithFallback } from "./figma/ImageWithFallback";

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

  const CARD_WIDTH = 350;
  const CARD_HEIGHT = 250;

  const getIndex = (index: number) => {
    return (index + movies.length) % movies.length;
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % movies.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [movies.length]);

  if (!movies || movies.length === 0) {
    return (
      <div className="relative w-full max-w-6xl mx-auto py-12 flex items-center justify-center">
        <span className="text-gray-500 text-lg">No movies found.</span>
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-6xl mx-auto py-12">
      <div className="relative flex items-center justify-center overflow-hidden">
        <button
          onClick={prevSlide}
          className="absolute left-2 z-20 bg-white/70 hover:bg-white rounded-full p-2 shadow"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div className="flex items-center justify-center gap-0 w-full">
          {[getIndex(currentIndex - 1), currentIndex, getIndex(currentIndex + 1)].map(
            (index, pos) => {
              const movie = movies[index];
              if (!movie) return null;
              const isCurrent = index === currentIndex;

              const width = isCurrent ? CARD_WIDTH + 60 : CARD_WIDTH * 1;
              const height = isCurrent ? CARD_HEIGHT : CARD_HEIGHT * 0.8;
              const zIndex = isCurrent ? 20 : 10;
              const marginLeft = pos === 1 ? '-100px' : undefined;
              const marginRight = pos === 1 ? '-100px' : undefined;

              return (
                <motion.div
                  key={movie.id}
                  onClick={() => onMovieClick?.(movie)}
                  className={`relative cursor-pointer flex-shrink-0 rounded-xl overflow-hidden shadow-lg ${
                    isCurrent ? "ring-4 ring-black/30" : ""
                  }`}
                  animate={{
                    opacity: isCurrent ? 1 : 0.6,
                  }}
                  transition={isCurrent
                    ? { duration: 0.7, type: 'spring', stiffness: 80, damping: 18 }
                    : { duration: 0 }}
                  style={{
                    width: `${width}px`,
                    height: `${height}px`,
                    zIndex,
                    marginLeft,
                    marginRight,
                  }}
                >

                  <div className="w-full h-full rounded-xl overflow-hidden">
                    <ImageWithFallback
                      src={movie.image}
                      alt={movie.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="absolute inset-0 bg-black/40 rounded-xl" />

                  {isCurrent && (
                    <div className="absolute bottom-4 left-4 text-white">
                      <h3 className="text-lg font-semibold">{movie.title}</h3>
                      <div className="flex items-center space-x-2 text-sm">
                        <Star className="w-3 h-3 fill-white text-white" />
                        <span>{movie.rating}</span>
                        <span>|</span>
                        <span>{movie.year}</span>
                      </div>
                    </div>
                  )}
                </motion.div>
              );
            }
          )}
        </div>
        <button
          onClick={nextSlide}
          className="absolute right-2 z-20 bg-white/70 hover:bg-white rounded-full p-2 shadow"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      <div className="flex justify-center space-x-2 mt-6">
        {movies.map((_, index) => (
          <span
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-3 w-3 rounded-full cursor-pointer transition-all ${
              index === currentIndex ? "bg-black scale-125" : "bg-gray-400"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
