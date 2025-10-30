import React from 'react';
import { Dialog, DialogContent } from './ui/dialog';
import { Button } from './ui/button';
import { Heart, Trash2 } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface WatchlistItem {
  id: number;
  movieId: string;
  title: string;
  poster?: string;
}

interface WatchlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  watchlist: WatchlistItem[];
  onRemove: (movieId: string) => void;
}

export function WatchlistModal({ isOpen, onClose, watchlist, onRemove }: WatchlistModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open: boolean) => !open && onClose()}>
      <DialogContent className="w-[960px] h-[560px] min-w-[960px] min-h-[560px] max-w-none p-6 sm:p-8 overflow-hidden">
        <div className="w-full h-full flex flex-col">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-gray-200 shrink-0">
            <div className="flex items-center gap-2 text-gray-900">
              <Heart className="w-5 h-5 text-gray-500" />
              <h3 className="text-xl font-semibold tracking-tight">My Watchlist</h3>
              <span className="text-sm text-gray-500">({watchlist.length})</span>
            </div>
          </div>
          <div className="flex-1 overflow-auto">
            {watchlist.length === 0 ? (
              <div className="h-full w-full grid place-items-center">
                <p className="text-sm text-gray-500">Your watchlist is empty.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6 md:gap-8 justify-items-center">
                {watchlist.map((item) => (
                  <div key={item.movieId} className="relative w-[160px]">
                    <div className="relative rounded-md overflow-hidden border border-gray-200 bg-white">
                      {item.poster ? (
                        <ImageWithFallback src={item.poster} alt={item.title} className="w-[160px] h-[245px] object-cover" />
                      ) : (
                        <div className="w-[160px] h-[245px] bg-gray-100 grid place-items-center text-gray-400 text-xs">No image</div>
                      )}
                      <Button
                        aria-label="Remove from watchlist"
                        title="Remove"
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 h-7 w-7 rounded-full bg-white/80 backdrop-blur-sm shadow-sm hover:bg-white"
                        onClick={() => onRemove(item.movieId)}
                      >
                        <Trash2 className="h-4 w-4 text-gray-700" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
