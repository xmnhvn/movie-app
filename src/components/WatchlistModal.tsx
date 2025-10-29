import React from 'react';
import { Dialog, DialogContent } from './ui/dialog';
import { Button } from './ui/button';

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
      <DialogContent className="max-w-3xl">
        <div className="p-6 w-full">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold">My Watchlist</h3>
          </div>
          {watchlist.length === 0 ? (
            <p className="text-sm text-gray-600">Your watchlist is empty.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {watchlist.map(item => (
                <div key={item.movieId} className="bg-white rounded shadow p-3 flex flex-col items-center">
                  {item.poster ? (
                    <img src={item.poster} alt={item.title} className="w-28 h-40 object-cover rounded mb-2" />
                  ) : (
                    <div className="w-28 h-40 bg-gray-200 rounded mb-2" />
                  )}
                  <div className="text-sm font-medium text-center">{item.title}</div>
                  <div className="mt-2">
                    <Button variant="destructive" onClick={() => onRemove(item.movieId)}>Remove</Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
