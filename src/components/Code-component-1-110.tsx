import { Badge } from './ui/badge';
import { motion } from 'motion/react';

interface GenreFilterProps {
  genres: string[];
  selectedGenres: string[];
  onGenreToggle: (genre: string) => void;
}

export function GenreFilter({ genres, selectedGenres, onGenreToggle }: GenreFilterProps) {
  return (
    <div className="flex flex-wrap justify-center gap-3 mb-8">
      {genres.map((genre) => {
        const isSelected = selectedGenres.includes(genre);
        return (
          <motion.div
            key={genre}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Badge
              variant={isSelected ? "default" : "outline"}
              className={`px-6 py-2 cursor-pointer transition-all duration-200 ${
                isSelected 
                  ? 'bg-purple-600 hover:bg-purple-700 text-white' 
                  : 'hover:bg-purple-100 hover:border-purple-300'
              }`}
              onClick={() => onGenreToggle(genre)}
            >
              {genre}
            </Badge>
          </motion.div>
        );
      })}
    </div>
  );
}