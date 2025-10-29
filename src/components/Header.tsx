import { Search, Menu, User, Heart, Home, Film, LogOut } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import GoWatchLogo from './GoWatch-logo.png';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from './ui/dropdown-menu';

interface HeaderProps {
  onSearch?: (query: string) => void;
  showNavigation?: boolean;
  onOpenWatchlist?: () => void;
  onOpenAuth?: () => void;
  watchlistCount?: number;
  currentUser?: any;
  onLogout?: () => void;
}

export function Header({ onSearch, showNavigation = false, onOpenWatchlist, onOpenAuth, watchlistCount, currentUser, onLogout }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-gray-800">
      <div className="relative z-10 px-4 py-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col items-center gap-8">
            <div className="flex items-center w-full justify-between gap-8">
              <div className="flex items-center gap-8">
                <img 
                  src={GoWatchLogo} 
                  alt="GoWatch Logo" 
                  className="h-8 w-auto drop-shadow-lg" 
                  style={{ filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))' }}
                />
              </div>

              <div className="flex items-center w-full max-w-2xl mx-auto">
                <div className="relative w-full">
                  <Input
                    type="text"
                    placeholder="Enter title..."
                    className="w-full h-12 pl-4 pr-12 bg-white dark:bg-gray-800/95 dark:text-white border-0 rounded-l-lg focus:bg-white dark:focus:bg-gray-800 transition-colors shadow-lg placeholder:text-gray-500 dark:placeholder:text-gray-400"
                    onChange={(e) => onSearch?.(e.target.value)}
                  />
                  <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 pointer-events-none">
                    <Search className="w-5 h-5 drop-shadow-sm" />
                  </span>
                </div>
              </div>

                <div className="flex items-center ml-4 space-x-4">
                {currentUser ? (
                  <div className="flex items-center gap-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button className="h-10 px-3 py-2 bg-gray-700 text-white rounded-xl flex items-center gap-2">
                          <User className="w-4 h-4 text-white" />
                          <span className="text-sm font-semibold">{currentUser.username}</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="min-w-[180px]">
                        <DropdownMenuLabel className="opacity-80">Signed in as {currentUser.username}</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => onOpenWatchlist && onOpenWatchlist()} className="flex items-center gap-2">
                          <Heart className="w-4 h-4" />
                          <span>Watchlist</span>
                          {typeof watchlistCount === 'number' && watchlistCount > 0 && (
                            <span
                              className="ml-auto pointer-events-none select-none h-5 min-w-[1.25rem] px-1 inline-flex items-center justify-center rounded-full bg-red-500 text-black text-[10px] font-bold"
                              aria-label={`Watchlist items: ${watchlistCount}`}
                            >
                              {watchlistCount > 99 ? '99+' : watchlistCount}
                            </span>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => onLogout && onLogout()} className="text-red-600">
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                ) : (
                  <Button onClick={() => onOpenAuth && onOpenAuth()} className="h-10 px-4 py-2 bg-gradient-to-r from-purple-700 via-purple-600 to-purple-500 text-white shadow-lg hover:from-purple-800 hover:via-purple-700 transition-colors rounded-xl flex items-center gap-3">
                    <User className="w-5 h-5 text-white" />
                    <span className="text-sm font-semibold">Sign in</span>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}