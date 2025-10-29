import React, { useMemo, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Eye, EyeOff, Pencil } from 'lucide-react';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: { username?: string; avatarUrl?: string } | null;
}

export function ProfileModal({ isOpen, onClose, user }: ProfileModalProps) {
  const rawName = (user?.username || '').trim();
  const [username, setUsername] = useState<string>(rawName || '');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const displayName = useMemo(() => {
    return rawName ? rawName.charAt(0).toUpperCase() + rawName.slice(1) : '';
  }, [rawName]);

  const initials = useMemo(() => {
    const n = rawName || 'U';
    return n
      .split(' ')
      .map((x: string) => x[0])
      .filter(Boolean)
      .slice(0, 2)
      .join('')
      .toUpperCase();
  }, [rawName]);

  return (
    <Dialog open={isOpen} onOpenChange={(open: boolean) => { if (!open) onClose(); }}>
      <DialogContent className="max-w-md p-8">
        <DialogHeader>
          <DialogTitle className="text-xl">Profile</DialogTitle>
        </DialogHeader>

        {/* Avatar with edit badge */}
        <div className="flex justify-center mt-1 mb-4">
          <div className="relative">
            <Avatar className="h-24 w-24">
              <AvatarImage src={user?.avatarUrl || ''} alt={displayName} />
              <AvatarFallback className="bg-sky-500/90 text-white text-lg">
                {initials}
              </AvatarFallback>
            </Avatar>
            <button
              type="button"
              className="absolute bottom-0 right-0 grid h-7 w-7 place-items-center rounded-full bg-black text-white shadow border border-white/70"
              aria-label="Edit avatar"
            >
              <Pencil className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Form fields */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="profile-username" className="text-base font-medium">Update Username</Label>
            <Input
              id="profile-username"
              value={username}
              placeholder="Mona"
              onChange={(e) => setUsername(e.target.value)}
              className="h-11 rounded-xl text-lg"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="profile-password" className="text-base font-medium">Update Password</Label>
            <div className="relative">
              <Input
                id="profile-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="**********"
                className="h-11 rounded-xl pr-12 text-lg"
              />
              <button
                type="button"
                onClick={() => setShowPassword(v => !v)}
                className="absolute inset-y-0 right-2 my-auto grid h-8 w-8 place-items-center rounded-md hover:bg-muted/60"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end mt-6">
          <Button
            onClick={onClose}
            className="px-6 h-10 rounded-lg bg-black text-white hover:bg-black/90"
          >
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
