import { Search, Menu, User, Heart, Home, Film } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';

interface HeaderProps {
  onSearch?: (query: string) => void;
  showNavigation?: boolean;
}

export function Header({ onSearch, showNavigation = false }: HeaderProps) {
  return (
    <header className="relative">
      {/* Purple gradient background */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-500 to-purple-700 opacity-90" />
      
      <div className="relative z-10 px-4 py-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {/* Logo */}
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-4xl lg:text-6xl font-bold text-white">
              GoWatch
            </h1>
            
            {showNavigation && (
              <div className="hidden md:flex items-center space-x-6">
                <Button variant="ghost" size="sm" className="text-white hover:text-purple-200">
                  <Home className="w-4 h-4 mr-2" />
                  Home
                </Button>
                <Button variant="ghost" size="sm" className="text-white hover:text-purple-200">
                  <Film className="w-4 h-4 mr-2" />
                  Movies
                </Button>
                <Button variant="ghost" size="sm" className="text-white hover:text-purple-200">
                  <Heart className="w-4 h-4 mr-2" />
                  Watchlist
                </Button>
                <Button variant="ghost" size="sm" className="text-white hover:text-purple-200">
                  <User className="w-4 h-4 mr-2" />
                  Profile
                </Button>
              </div>
            )}
            
            <Button variant="ghost" size="sm" className="md:hidden text-white">
              <Menu className="w-6 h-6" />
            </Button>
          </div>
          
          {/* Search Bar */}
          <div className="flex items-center max-w-2xl mx-auto">
            <div className="relative flex-1">
              <Input
                type="text"
                placeholder="Enter title..."
                className="w-full h-12 pl-4 pr-12 bg-white/90 border-0 rounded-l-lg focus:bg-white transition-colors"
                onChange={(e) => onSearch?.(e.target.value)}
              />
            </div>
            <Button 
              size="lg" 
              className="h-12 px-6 bg-gray-800 hover:bg-gray-700 text-white rounded-r-lg rounded-l-none border-0"
            >
              <Search className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}