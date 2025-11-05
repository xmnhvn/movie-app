import React, { useMemo, useRef, useState } from 'react';
import { Dialog, DialogContentWide, DialogHeader, DialogTitle, DialogDescription, DialogContent, DialogFooter } from './ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from './ui/dropdown-menu';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Eye, EyeOff, BadgeCheck, AlertTriangle, Trash2, MoreVertical } from 'lucide-react';
import { mediaUrl } from '../lib/api';

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
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(user?.avatarUrl ? mediaUrl(user.avatarUrl) : null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarRemoved, setAvatarRemoved] = useState<boolean>(false);
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [confirmDirty, setConfirmDirty] = useState<boolean>(false);
  const [confirmOpen, setConfirmOpen] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

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

  const onPickAvatar = () => {
    fileInputRef.current?.click();
  };

  const onAvatarChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    setAvatarFile(file);
    const url = URL.createObjectURL(file);
    setAvatarPreview(url);
    try { window.dispatchEvent(new CustomEvent('gowatch:avatar:preview', { detail: url })); } catch {}
    setAvatarRemoved(false);
  };

  const handleRemoveAvatar = () => {
    setAvatarPreview(null);
    setAvatarFile(null);
    try { window.dispatchEvent(new CustomEvent('gowatch:avatar:preview', { detail: null })); } catch {}
    setAvatarRemoved(true);
  };

  const usernameChanged = (username || '').trim() !== (rawName || '');
  const passwordValid = !password || password.length >= 6;
  const passwordsMatch = !password || password === confirmPassword;
  const isDirty = usernameChanged || !!password || !!avatarFile || avatarRemoved;
  const canSave = isDirty && passwordValid && passwordsMatch && !saving;

  const handleDelete = async () => {
    const ok = window.confirm(
      'Are you sure you want to permanently delete your account?\nThis will remove your profile, avatar, and all your saved movies/watchlist.\nThis action cannot be undone.'
    );
    if (!ok) return;

    setSaving(true);
    setError(null);
    try {
      const { deleteAccount } = await import('../lib/auth');
      await deleteAccount();

      try { localStorage.removeItem('gowatch_user'); } catch {}
      try { localStorage.removeItem('gowatch_token'); } catch {}
      try { window.dispatchEvent(new CustomEvent('gowatch:logout')); } catch {}
      try { window.dispatchEvent(new CustomEvent('gowatch:avatar:preview', { detail: null })); } catch {}
      try { window.dispatchEvent(new CustomEvent('gowatch:toast', { detail: { message: 'Account deleted', type: 'success' } })); } catch {}

      onClose();
      setTimeout(() => {
        window.location.href = '/';
      }, 150);
    } catch (err: any) {
      const msg = err?.response?.data?.error || err?.message || 'Failed to delete account';
      setError(msg);
      try { window.dispatchEvent(new CustomEvent('gowatch:toast', { detail: { message: msg, type: 'error' } })); } catch {}
    } finally {
      setSaving(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      let updatedUser: any = user || {};

      if (avatarRemoved && !avatarFile) {
        const { removeAvatar } = await import('../lib/auth');
        updatedUser = await removeAvatar();
      }
      if (avatarFile) {
        const { uploadAvatar } = await import('../lib/auth');
        updatedUser = await uploadAvatar(avatarFile);
      }

      const fields: any = {};
      if (username && username !== rawName) fields.username = username.trim();
      if (password) fields.password = password;
      if (Object.keys(fields).length) {
        const { updateProfile } = await import('../lib/auth');
        updatedUser = await updateProfile(fields);
      }

      if (updatedUser) {
        try { localStorage.setItem('gowatch_user', JSON.stringify(updatedUser)); } catch {}
        try { window.dispatchEvent(new CustomEvent('gowatch:login', { detail: updatedUser })); } catch {}
        try { window.dispatchEvent(new CustomEvent('gowatch:toast', { detail: { message: 'Profile updated', type: 'success' } })); } catch {}
        try { window.dispatchEvent(new CustomEvent('gowatch:avatar:preview', { detail: null })); } catch {}
      }
      onClose();
    } catch (err: any) {
      const msg = err?.response?.data?.error || err?.message || 'Failed to update profile';
      setError(msg);
      try { window.dispatchEvent(new CustomEvent('gowatch:toast', { detail: { message: msg, type: 'error' } })); } catch {}
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open: boolean) => { if (!open) onClose(); }}>
      <DialogContentWide className="max-w-none w-[min(96vw,1100px)] max-h-[90vh] px-8 py-8 overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl text-center">User profile</DialogTitle>
          <DialogDescription className="text-base">
            Manage your information and your account settings.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-2 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 min-w-[64px] min-h-[64px] max-w-[64px] max-h-[64px] border border-black/10 bg-white">
              {avatarPreview ? (
                <AvatarImage src={avatarPreview} alt={displayName} className="object-cover object-center" />
              ) : null}
              <AvatarFallback className="bg-sky-500/90 text-black text-xl font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="text-base font-medium">{displayName || 'Your name'}</div>
              <div className="text-sm text-muted-foreground">{rawName ? `${rawName}@gowatch.app` : 'No email on file'}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button type="button" variant="ghost" size="icon" title="More actions" className="h-8 w-8 rounded-full">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44 text-center">
                <DropdownMenuItem className="justify-center" onClick={onPickAvatar}>{avatarPreview ? 'Change photo' : 'Add photo'}</DropdownMenuItem>
                <DropdownMenuItem className="justify-center" variant="destructive" onClick={handleRemoveAvatar} disabled={!avatarPreview}>
                  Remove photo
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="justify-center" variant="destructive" onClick={() => setConfirmOpen(true)}>
                  Delete account
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={onAvatarChange} />
          </div>
        </div>

        <div className="mt-5 divide-y">
          <div className="py-5 grid grid-cols-12 gap-4 items-center mt-0">
            <div className="col-span-12 sm:col-span-3">
              <Label htmlFor="profile-username" className="text-sm font-medium">Username</Label>
            </div>
            <div className="col-span-12 sm:col-span-9">
              <div className="flex items-center gap-2">
                <div className="relative w-full">
                  <Input
                    id="profile-username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="h-10 rounded-lg pr-9 text-base"
                  />
                  <BadgeCheck className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 h-5 w-5 text-sky-600" />
                </div>
              </div>
            </div>
          </div>

          <div className="py-5 grid grid-cols-12 gap-4 items-start relative">
            <div className="col-span-12 sm:col-span-3 mt-2">
              <Label htmlFor="profile-password" className="text-sm font-medium">New password</Label>
            </div>
            <div className="col-span-12 sm:col-span-9 relative">
              <div className="relative">
                <Input
                  id="profile-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="********"
                  className="h-10 rounded-lg pr-9 text-base"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 grid place-items-center rounded-md hover:bg-muted/60"
                >
                  {showPassword ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
                </button>
              </div>
              {password && password.length < 6 && (
                <div className="absolute left-1/2 -translate-x-1/2 top-full mt-1 z-50 animate-fade-in">
                  <div className="relative rounded-md border border-gray-300 bg-white text-gray-900 text-sm px-3 py-2 shadow-[0_2px_8px_rgba(0,0,0,0.12)] w-max max-w-[280px]">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-yellow-600" />
                      <span>Password must be at least 6 characters.</span>
                    </div>
                    <div className="absolute left-1/2 -translate-x-1/2 top-0 -translate-y-1/2 h-3 w-3 rotate-45 bg-white border-t border-l border-gray-300"></div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="py-5 grid grid-cols-12 gap-4 items-center relative">
            <div className="col-span-12 sm:col-span-3 mt-2">
              <Label htmlFor="profile-password-confirm" className="text-sm font-medium">Confirm password</Label>
            </div>
            <div className="col-span-12 sm:col-span-9 relative">
              <Input
                id="profile-password-confirm"
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => { setConfirmPassword(e.target.value); setConfirmDirty(true); }}
                placeholder="********"
                className="h-10 rounded-lg text-base"
              />
              {password && confirmDirty && !!confirmPassword && password !== confirmPassword && (
                <div className="absolute left-1/2 -translate-x-1/2 top-full mt-1 z-50 animate-fade-in">
                  <div className="relative rounded-md border border-gray-300 bg-white text-gray-900 text-sm px-3 py-2 shadow-[0_2px_8px_rgba(0,0,0,0.12)] w-max max-w-[280px]">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-yellow-600" />
                      <span>Passwords do not match.</span>
                    </div>
                    <div className="absolute left-1/2 -translate-x-1/2 top-0 -translate-y-1/2 h-3 w-3 rotate-45 bg-white border-t border-l border-gray-300"></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {error && (
          <div className="mt-3 text-sm text-red-600">{error}</div>
        )}

        <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end mt-3 gap-3">
          <div className="flex gap-3">
            <Button onClick={onClose} variant="outline" className="px-4 h-10 rounded-lg" disabled={saving}>
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="px-6 h-10 rounded-lg bg-black text-white hover:bg-black/90"
              disabled={!canSave}
            >
              {saving ? 'Saving…' : 'Save changes'}
            </Button>
          </div>
        </div>
      </DialogContentWide>

      <Dialog open={confirmOpen} onOpenChange={(o) => setConfirmOpen(o)}>
        <DialogContent className="min-w-[150px]max-w-150px]">
          <div className="flex items-start gap-3">
            <div className="flex-1">
              <DialogHeader>
                <DialogTitle className="text-xl">Delete account</DialogTitle>
                <DialogDescription>
                  This will permanently remove your account, profile details, avatar, and your entire watchlist. This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setConfirmOpen(false)}
              disabled={saving}
              className="h-10 rounded-lg"
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={async () => { setConfirmOpen(false); await handleDelete(); }}
              disabled={saving}
              className="h-10 rounded-lg"
            >
              {saving ? 'Deleting…' : 'Delete permanently'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Dialog>
  );
}
