import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent } from './ui/dialog';
import { Button } from './ui/button';
import {
  Heart,
  ChevronLeft,
  ChevronRight,
  Pencil,
  CheckSquare,
  Square,
  Trash2,
  X,
} from 'lucide-react';
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

export function WatchlistModal({
  isOpen,
  onClose,
  watchlist,
  onRemove,
}: WatchlistModalProps) {
  const itemsPerPage = 10; // 5 cols × 2 rows
  const [currentPage, setCurrentPage] = useState(1);
  const [editMode, setEditMode] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [showConfirm, setShowConfirm] = useState(false);

  const totalPages = Math.ceil(watchlist.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = watchlist.slice(startIndex, startIndex + itemsPerPage);

  const handlePrev = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNext = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  const toggleEditMode = () => {
    setEditMode(!editMode);
    setSelectedItems([]);
  };

  const toggleSelect = (movieId: string) => {
    setSelectedItems((prev) =>
      prev.includes(movieId)
        ? prev.filter((id) => id !== movieId)
        : [...prev, movieId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedItems.length === watchlist.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(watchlist.map((item) => item.movieId));
    }
  };

  const confirmDelete = () => {
    if (selectedItems.length > 0) {
      setShowConfirm(true);
    }
  };

  const cancelDelete = () => setShowConfirm(false);

  const handleDeleteSelected = () => {
    selectedItems.forEach((id) => onRemove(id));
    setSelectedItems([]);
    setEditMode(false);
    setShowConfirm(false);
  };

  // ✅ Auto-adjust page after deletions
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    } else if (totalPages === 0) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  return (
    <Dialog open={isOpen} onOpenChange={(open: boolean) => !open && onClose()}>
      <DialogContent
        className="p-6 sm:p-6 overflow-hidden"
        style={{
          width: '880px',
          minWidth: '880px',
          minHeight: '600px',
          maxWidth: 'none',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div className="w-full h-full flex flex-col">
          {/* Header */}
          <div className="mt-4 flex items-center justify-between pb-3 mb-4 border-b border-gray-200 sticky top-0 bg-white z-10">
            <div className="mb-3 flex items-center gap-2 text-gray-900">
              <Heart className="w-5 h-5 text-gray-500" />
              <h3 className="text-xl font-semibold tracking-tight">
                My Watchlist
              </h3>
              <span className="text-sm text-gray-500">
                ({watchlist.length})
              </span>
            </div>

            {/* Right-side controls */}
            {editMode ? (
              <div className="mr-2 flex items-center gap-2">
                <Button
                  variant="ghost"
                  onClick={toggleSelectAll}
                  className="font-semibold text-gray-700 hover:text-gray-900"
                >
                  {selectedItems.length === watchlist.length
                    ? 'Unselect All'
                    : 'Select All'}
                </Button>
                <Button
                  variant="ghost"
                  onClick={confirmDelete}
                  disabled={selectedItems.length === 0}
                  className={`font-semibold flex items-center gap-1 ${
                    selectedItems.length > 0
                      ? 'text-red-600 hover:text-red-700'
                      : 'text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </Button>
                <Button
                  variant="ghost"
                  onClick={toggleEditMode}
                  className="font-semibold text-gray-500 hover:text-gray-700 mr-2"
                >
                  <X className="h-4 w-4 mr-1" />
                  Cancel
                </Button>
              </div>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                title="Edit Watchlist"
                onClick={toggleEditMode}
                className="h-6 w-6 rounded-full hover:bg-gray-100 mr-2"
              >
                <Pencil className="h-4 w-4 text-gray-700 mr-2" />
              </Button>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 flex flex-col overflow-y-auto">
            {watchlist.length === 0 ? (
              <div className="flex-1 grid place-items-center">
                <p className="text-center text-sm text-gray-500">
                  Your watchlist is empty.
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 justify-items-center">
                  {currentItems.map((item) => (
                    <div key={item.movieId} className="relative w-[110px]">
                      <div className="relative rounded-md overflow-hidden border border-gray-200 bg-white">
                        {editMode && (
                          <button
                            onClick={() => toggleSelect(item.movieId)}
                            className="absolute top-2 left-2 z-10 bg-white/90 rounded-sm p-1 hover:bg-white"
                          >
                            {selectedItems.includes(item.movieId) ? (
                              <CheckSquare className="h-4 w-4 text-blue-600" />
                            ) : (
                              <Square className="h-4 w-4 text-gray-400" />
                            )}
                          </button>
                        )}
                        {item.poster ? (
                          <ImageWithFallback
                            src={item.poster}
                            alt={item.title}
                            className="w-[110px] h-[150px] object-cover"
                          />
                        ) : (
                          <div className="w-[110px] h-[150px] bg-gray-100 grid place-items-center text-gray-400 text-xs">
                            No image
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-4 mt-4 shrink-0">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handlePrev}
                      disabled={currentPage === 1}
                      className="h-8 w-8"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </Button>
                    <span className="text-sm text-gray-600">
                      Page {currentPage} of {totalPages}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleNext}
                      disabled={currentPage === totalPages}
                      className="h-8 w-8"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {showConfirm && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-[320px] text-center">
              <h4 className="text-lg font-semibold mb-2">Confirm Deletion</h4>
              <p className="text-sm text-gray-600 mb-6">
                Are you sure you want to delete{' '}
                <span className="font-medium">{selectedItems.length}</span>{' '}
                selected item{selectedItems.length > 1 ? 's' : ''}?
              </p>
              <div className="flex justify-center gap-4">
                <Button
                  onClick={handleDeleteSelected}
                  className="flex-1 border-gray-300 text-white hover:bg-gray-100 font-semibold py-2 rounded-lg"
                >
                  Yes, Delete
                </Button>
                <Button
                  onClick={cancelDelete}
                  variant="outline"
                  className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-100 font-semibold py-2 rounded-lg transition-colors"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
