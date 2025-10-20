import { X, Star, Play, Plus, Calendar, Clock } from 'lucide-react';
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

interface MovieModalProps {
  movie: Movie | null;
  isOpen: boolean;
  onClose: () => void;
}

export function MovieModal({ movie, isOpen, onClose }: MovieModalProps) {
  if (!movie) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
            onClick={onClose}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative h-64 md:h-80">
                <ImageWithFallback
                  src={movie.image}
                  alt={movie.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white"
                >
                  <X className="w-5 h-5" />
                </Button>
                
                <div className="absolute bottom-4 left-4 right-4">
                  <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{movie.title}</h1>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      <span className="text-white font-semibold">{movie.rating}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-white">
                      <Calendar className="w-4 h-4" />
                      <span>{movie.year}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-white">
                      <Clock className="w-4 h-4" />
                      <span>2h 15m</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex flex-wrap gap-3 mb-6">
                  <div className="flex items-center gap-3">
                    <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
                      <Play className="w-5 h-5 mr-2" />
                      Watch Now
                    </Button>
                    <Button size="lg" variant="outline" className="flex items-center gap-2" onClick={() => {
                      try {
                        window.dispatchEvent(new CustomEvent('gowatch:saveMovie', { detail: movie }));
                      } catch (err) {
                        // ignore
                      }
                    }}>
                      <Star className="w-5 h-5" />
                      Save
                    </Button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                  {movie.genre.map((genre) => (
                    <Badge key={genre} variant="secondary" className="px-3 py-1">
                      {genre}
                    </Badge>
                  ))}
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-3">Overview</h3>
                  <p className="text-gray-600 leading-relaxed">
                    {movie.description || 
                      `${movie.title} is an incredible ${movie.genre[0]?.toLowerCase()} film from ${movie.year}. Experience stunning visuals, compelling storytelling, and unforgettable performances in this must-watch movie. Join millions of viewers who have already discovered this cinematic masterpiece.`
                    }
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 pt-6 border-t">
                  <div>
                    <h4 className="font-semibold mb-2">Cast</h4>
                    <p className="text-gray-600">John Doe, Jane Smith, Mike Johnson</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Director</h4>
                    <p className="text-gray-600">Christopher Nolan</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}