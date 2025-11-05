import { Search, Menu, User, Heart, Home, Film, LogOut, MoreHorizontal } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
// Resolve logo path via URL to avoid needing .png module declarations
const GoWatchLogo = new URL('./GoWatch-logo.png', import.meta.url).href;
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { mediaUrl } from '../lib/api';
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
  // Maintain a local copy of the user that can update immediately from global events
  const [headerUser, setHeaderUser] = useState<any>(currentUser || null);

  // Keep local user in sync with prop
  useEffect(() => {
    setHeaderUser(currentUser || null);
  }, [currentUser]);

  // Also react immediately to profile updates broadcasted globally
  useEffect(() => {
    const onLogin = (e: any) => {
      const u = e?.detail || null;
      if (u) setHeaderUser(u);
      else {
        try {
          const raw = localStorage.getItem('gowatch_user');
          if (raw) setHeaderUser(JSON.parse(raw));
        } catch {}
      }
    };
    window.addEventListener('gowatch:login', onLogin as EventListener);
    return () => window.removeEventListener('gowatch:login', onLogin as EventListener);
  }, []);

  const userName = (headerUser?.username || '').trim();
  const displayName = userName ? userName.charAt(0).toUpperCase() + userName.slice(1) : '';
  const initials = userName
    .split(' ')
    .map((n: string) => n[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();
  const [tempAvatar, setTempAvatar] = useState<string | null>(null);
  const [displayedAvatar, setDisplayedAvatar] = useState<string | null>(null);
  const [bust, setBust] = useState<number>(0);
  const avatarSrcBase = headerUser?.avatarUrl ? mediaUrl(headerUser.avatarUrl) : '';
  const networkAvatar = avatarSrcBase ? `${avatarSrcBase}${avatarSrcBase.includes('?') ? '&' : '?'}v=${bust}` : '';

  useEffect(() => {
    if (headerUser?.avatarUrl) setBust(Date.now());
  }, [headerUser?.avatarUrl]);

  useEffect(() => {
    if (!networkAvatar) {
      if (!tempAvatar) setDisplayedAvatar(null);
      return;
    }
    const img = new Image();
    img.onload = () => {
      setDisplayedAvatar(networkAvatar);
      setTempAvatar(null);
    };
    img.onerror = () => {
    };
    img.src = networkAvatar;
  }, [networkAvatar]);

  useEffect(() => {
    const onLogin = () => setBust(Date.now());
    const onLogoutEvt = () => setBust(0);
    window.addEventListener('gowatch:login', onLogin as EventListener);
    window.addEventListener('gowatch:logout', onLogoutEvt as EventListener);
    return () => {
      window.removeEventListener('gowatch:login', onLogin as EventListener);
      window.removeEventListener('gowatch:logout', onLogoutEvt as EventListener);
    };
  }, []);

  useEffect(() => {
    const onPreview = (e: any) => {
      const val = e?.detail ?? null;
      if (typeof val === 'string' && val) {
        setTempAvatar(val);
        setDisplayedAvatar(val);
      } else {
        setTempAvatar(null);
        if (!networkAvatar) setDisplayedAvatar(null);
      }
    };
    window.addEventListener('gowatch:avatar:preview', onPreview as EventListener);
    return () => window.removeEventListener('gowatch:avatar:preview', onPreview as EventListener);
  }, []);
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
                    {/* Watchlist button placed to the left of the user menu */}
                    <Button
                      onClick={() => onOpenWatchlist && onOpenWatchlist()}
                      className="h-10 px-4 py-2 bg-gray-700 text-white rounded-xl flex items-center gap-2"
                      aria-label="Open watchlist"
                    >
                      <Heart className="w-5 h-5" />
                      <span className="text-sm font-semibold">Watchlist</span>
                      {typeof watchlistCount === 'number' && watchlistCount > 0 && (
                        <span
                          className="ml-1 pointer-events-none select-none h-5 min-w-[1.25rem] px-1 inline-flex items-center justify-center rounded-full bg-red-500 text-purple-100 text-[10px] font-bold"
                          aria-label={`Watchlist items: ${watchlistCount}`}
                        >
                          {watchlistCount > 99 ? '99+' : watchlistCount}
                        </span>
                      )}
                    </Button>
                    <DropdownMenu modal={false}>
                      <DropdownMenuTrigger asChild>
                        <Button className="h-10 px-6 py-4 bg-gray-700 text-white rounded-xl flex items-center gap-2">
                          <Avatar key={displayedAvatar || 'noimg'} className="h-8 w-8">
                            {displayedAvatar ? (
                              <AvatarImage key={displayedAvatar} src={displayedAvatar} alt={userName} />
                            ) : null}
                            <AvatarFallback className="text-[12px] text-black">{initials || 'U'}</AvatarFallback>
                          </Avatar>
                          <span className="text-base font-semibold">{displayName}</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="center" className="w-[280px]">
                        <DropdownMenuItem
                          className="flex items-center justify-between px-2 py-2 cursor-pointer"
                          onSelect={(_e: any) => {
                            try { window.dispatchEvent(new CustomEvent('gowatch:openProfile')); } catch {}
                          }}
                        >
                          <div className="flex items-center gap-2">
                            <Avatar key={displayedAvatar || 'noimg'} className="h-8 w-8">
                              {displayedAvatar ? (
                                <AvatarImage key={displayedAvatar} src={displayedAvatar} alt={userName} />
                              ) : null}
                              <AvatarFallback className="text-[12px] text-black">{initials || 'U'}</AvatarFallback>
                            </Avatar>
                            <span className="text-base font-medium">{displayName}</span>
                          </div>
                          <MoreHorizontal className="w-4 h-4 text-gray-400" />
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
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={() => onOpenWatchlist && onOpenWatchlist()}
                      className="h-10 px-4 py-2 bg-gray-700 text-white rounded-xl flex items-center gap-2"
                      aria-label="Open watchlist"
                    >
                      <Heart className="w-5 h-5" />
                      <span className="text-sm font-semibold">Watchlist</span>
                    </Button>
                    <Button onClick={() => onOpenAuth && onOpenAuth()} className="h-10 px-4 py-2 bg-gradient-to-r from-purple-700 via-purple-600 to-purple-500 text-white shadow-lg hover:from-purple-800 hover:via-purple-700 transition-colors rounded-xl flex items-center gap-3">
                      <User className="w-5 h-5 text-white" />
                      <span className="text-sm font-semibold">Sign in</span>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}