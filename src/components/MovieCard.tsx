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
  const sizeClasses = {
    small: 'w-40 h-60',
    medium: 'w-48 h-72',
    large: 'w-56 h-80'
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -5 }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="cursor-pointer"
      onClick={() => onClick?.(movie)}
    >
      <Card className={`${sizeClasses[size]} overflow-hidden group relative bg-gray-100 hover:shadow-xl transition-all duration-300`}>
        <div className="relative w-full h-3/4">
          <ImageWithFallback
            src={movie.image}
            alt={movie.title}
            className="w-full h-full object-cover"
          />
          
          {/* Overlay on hover */}
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
          
          {/* Rating badge */}
          <div className="absolute top-2 right-2">
            <Badge variant="secondary" className="bg-black/70 text-white border-0">
              <Star className="w-3 h-3 mr-1 fill-yellow-400 text-yellow-400" />
              {movie.rating}
            </Badge>
          </div>
        </div>
        
        <div className="p-4 h-1/4">
          <h3 className="font-semibold text-sm mb-1 line-clamp-1">{movie.title}</h3>
          <p className="text-xs text-gray-600">{movie.year}</p>
          <div className="flex flex-wrap gap-1 mt-2">
            {movie.genre.slice(0, 2).map((g) => (
              <Badge key={g} variant="outline" className="text-xs px-2 py-0">
                {g}
              </Badge>
            ))}
          </div>
        </div>
      </Card>
    </motion.div>
  );
}