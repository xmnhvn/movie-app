import { Star, Play, Plus, Info } from 'lucide-react';
import { useState, useEffect } from 'react';
import { addToWatchlist, removeFromWatchlist } from '../lib/watchlist';
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
  demoUserId?: number | null;
  isSaved?: boolean;
}

export function MovieCard({ movie, size = 'medium', onClick, demoUserId = null, isSaved = false }: MovieCardProps) {
  const cardSize = 'w-[170px] h-[260px]';
  const [saved, setSaved] = useState<boolean>(!!isSaved);

  useEffect(() => {
    setSaved(!!isSaved);
  }, [movie.id, isSaved]);

  const handleToggleSave = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!demoUserId) return;
    try {
      if (!saved) {
        await addToWatchlist(demoUserId, { id: movie.id, title: movie.title, poster: movie.image });
        setSaved(true);
      } else {
        await removeFromWatchlist(demoUserId, movie.id);
        setSaved(false);
      }
    } catch (err) {
      console.warn('watchlist op failed', err);
    }
  };

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
          <button onClick={handleToggleSave} disabled={!demoUserId} title={!demoUserId ? 'Sign in to save' : 'Save to watchlist'} className={`absolute top-3 right-3 z-20 rounded-full p-2 text-white backdrop-blur-sm ${!demoUserId ? 'bg-white/10 opacity-50 cursor-not-allowed' : 'bg-white/10'}`}>
            <Star className={`w-4 h-4 ${saved ? 'fill-yellow-400 text-yellow-400' : ''}`} />
          </button>
          <ImageWithFallback
            src={movie.image}
            alt={movie.title}
            className="w-full h-full object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/70 to-black/30"></div>
          <div className="absolute inset-0 bg-[radial-gradient(white_1px,transparent_1px)] [background-size:20px_20px] opacity-10"></div>

          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>

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