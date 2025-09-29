import { Star, Play, Plus, Info } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card } from './ui/card';
import { motion } from 'motion/react';
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

interface MovieCardProps {
  movie: Movie;
  size?: 'small' | 'medium' | 'large';
  onClick?: (movie: Movie) => void;
}

export function MovieCard({ movie, size = 'medium', onClick }: MovieCardProps) {
  const cardSize = 'w-[170px] h-[260px]';

  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -5 }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className={`cursor-pointer ${cardSize}`}
      onClick={() => onClick?.(movie)}
    >
      <Card className={`overflow-hidden group relative bg-gradient-to-b from-gray-900 via-gray-800 to-black hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-300 w-full h-full border-gray-700 dark:border-gray-600`}>
        <div className="relative w-full h-full">
          <ImageWithFallback
            src={movie.image}
            alt={movie.title}
            className="w-full h-full object-cover"
          />
          {/* Enhanced overlay for better text visibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/70 to-black/30"></div>
          <div className="absolute inset-0 bg-[radial-gradient(white_1px,transparent_1px)] [background-size:20px_20px] opacity-10"></div>
          
          {/* Additional contrast enhancement */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
          
          {/* Hover overlay */}
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <div className="flex space-x-2">
              <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                <Play className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="outline" className="bg-white/90 hover:bg-white">
                <Plus className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="outline" className="bg-white/90 hover:bg-white">
                <Info className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Movie title and info overlay with rounded transparent background */}
          <div className="absolute bottom-0 left-0 right-0 p-3 text-white bg-black/60 backdrop-blur-sm rounded-t-2xl">
            <h3 className="font-bold text-sm mb-1 line-clamp-2 drop-shadow-lg leading-tight">
              {movie.title}
            </h3>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                <span className="text-xs font-medium">{movie.rating}</span>
                <span className="text-xs text-gray-300">|</span>
                <span className="text-xs text-gray-300">{movie.year}</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-1 mt-1">
              {movie.genre.slice(0, 2).map((g) => (
                <Badge key={g} variant="outline" className="text-xs px-2 py-1 bg-white/20 text-white border-white/30">
                  {g}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}