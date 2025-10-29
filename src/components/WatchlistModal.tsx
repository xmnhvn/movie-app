import React from 'react';
import { Dialog, DialogContent } from './ui/dialog';
import { Button } from './ui/button';
import { Heart } from 'lucide-react';

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
      <DialogContent className="max-w-3xl sm:w-[900px] sm:h-[560px] p-6 sm:p-8 overflow-hidden">
        <div className="w-full h-full flex flex-col">
          <div className="flex items-center justify-between mb-4 shrink-0">
            <div className="flex items-center gap-2">
              <Heart className="w-6 h-6 text-gray-700" />
              <h3 className="text-2xl font-semibold">My Watchlist</h3>
            </div>
          </div>
          <div className="flex-1 overflow-auto">
            {watchlist.length === 0 ? (
              <p className="text-sm text-gray-600">Your watchlist is empty.</p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {watchlist.map((item) => (
                  <div key={item.movieId} className="bg-white rounded shadow p-3 flex flex-col items-center w-[160px]">
                    {item.poster ? (
                      <img src={item.poster} alt={item.title} className="w-[160px] h-[240px] object-cover rounded mb-2" />
                    ) : (
                      <div className="w-[160px] h-[240px] bg-gray-200 rounded mb-2" />
                    )}
                    <div className="mt-2 w-full">
                      <Button className="w-full" variant="destructive" onClick={() => onRemove(item.movieId)}>
                        Remove
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
