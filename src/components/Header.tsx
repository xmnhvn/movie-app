import { Search, Menu, User, Heart, Home, Film } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import GoWatchLogo from './GoWatch-logo.png';

interface HeaderProps {
  onSearch?: (query: string) => void;
  showNavigation?: boolean;
}

export function Header({ onSearch, showNavigation = false }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-gray-800">
      <div className="relative z-10 px-4 py-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col items-center gap-8">
            <div className="flex items-center w-full justify-center gap-8">
              <img 
                src={GoWatchLogo} 
                alt="GoWatch Logo" 
                className="h-8 w-auto drop-shadow-lg" 
                style={{ filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))' }}
              />
              <div className="flex items-center w-full max-w-2xl">
                <div className="relative flex-1">
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
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}