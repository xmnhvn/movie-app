import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: { username?: string; avatarUrl?: string } | null;
}

export function ProfileModal({ isOpen, onClose, user }: ProfileModalProps) {
  const userName = (user?.username || '').trim();
  const displayName = userName ? userName.charAt(0).toUpperCase() + userName.slice(1) : '';
  const initials = userName
    .split(' ')
    .map((n: string) => n[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
  <Dialog open={isOpen} onOpenChange={(open: boolean) => { if (!open) onClose(); }}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Account</DialogTitle>
        </DialogHeader>
        <div className="flex items-center gap-3 mt-2">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user?.avatarUrl || ''} alt={displayName} />
            <AvatarFallback className="text-black">{initials || 'U'}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-medium">{displayName || 'Unknown'}</span>
            {/* Placeholder for more account info */}
          </div>
        </div>
        <div className="flex justify-end mt-6">
          <Button onClick={onClose} className="px-4">Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
