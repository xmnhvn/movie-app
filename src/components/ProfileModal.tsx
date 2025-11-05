import React, { useMemo, useRef, useState } from 'react';
import { Dialog, DialogContentWide, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Eye, EyeOff, BadgeCheck } from 'lucide-react';
import { mediaUrl } from '../lib/api';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: { username?: string; avatarUrl?: string } | null;
}

export function ProfileModal({ isOpen, onClose, user }: ProfileModalProps) {
  const rawName = (user?.username || '').trim();
  const [username, setUsername] = useState<string>(rawName || '');
  // New, non-functional fields to mirror the reference layout (not saved yet)
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [email] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(user?.avatarUrl ? mediaUrl(user.avatarUrl) : null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarRemoved, setAvatarRemoved] = useState<boolean>(false);
  const [confirmPassword, setConfirmPassword] = useState<string>('');
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

  const handleDelete = () => {
    // No delete endpoint in server; provide a friendly notice.
    try { window.dispatchEvent(new CustomEvent('gowatch:toast', { detail: { message: 'Delete account is not available yet.', type: 'info' } })); } catch {}
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
  <DialogContentWide className="max-w-none w-[min(96vw,900px)] max-h-[90vh] px-8 py-8 overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">User profile</DialogTitle>
          <DialogDescription className="text-base">
            Manage your information and your account settings.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-2 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 border border-black/10 bg-white">
              {avatarPreview ? (
                <AvatarImage src={avatarPreview} alt={displayName} className="object-cover object-center" />
              ) : null}
              <AvatarFallback className="bg-sky-500/90 text-white">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="text-base font-medium">{displayName || 'Your name'}</div>
              <div className="text-sm text-muted-foreground">{rawName ? `${rawName}@gowatch.app` : 'No email on file'}</div>
            </div>
          </div>
        </div>

        {/* Fields area */}
        <div className="mt-5 divide-y">
          <div className="py-5 grid grid-cols-12 gap-4 items-center">
            <div className="col-span-12 sm:col-span-9 flex items-center gap-3">
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={onAvatarChange} />
              <Button type="button" variant="outline" size="sm" onClick={onPickAvatar}>Change Photo</Button>
              {avatarPreview && (
                <Button type="button" variant="ghost" size="sm" onClick={handleRemoveAvatar} className="text-red-600 hover:text-red-700">
                  Remove
                </Button>
              )}
            </div>
          </div>

          {/* Username row */}
          <div className="py-5 grid grid-cols-12 gap-4 items-center">
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

          {/* Password rows */}
          <div className="py-5 grid grid-cols-12 gap-4 items-start">
            <div className="col-span-12 sm:col-span-3">
              <Label htmlFor="profile-password" className="text-sm font-medium">New password</Label>
            </div>
            <div className="col-span-12 sm:col-span-9">
              <div className="relative">
                <Input
                  id="profile-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="********"
                  className="h-10 rounded-lg pr-12 text-base"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute inset-y-0 right-2 my-auto grid h-8 w-8 place-items-center rounded-md hover:bg-muted/60"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">Leave blank to keep your current password.</p>
            </div>
          </div>

          <div className="py-5 grid grid-cols-12 gap-4 items-center">
            <div className="col-span-12 sm:col-span-3">
              <Label htmlFor="profile-password-confirm" className="text-sm font-medium">Confirm password</Label>
            </div>
            <div className="col-span-12 sm:col-span-9">
              <Input
                id="profile-password-confirm"
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="********"
                className="h-10 rounded-lg text-base"
              />
              {!!password && password !== confirmPassword && (
                <p className="mt-2 text-xs text-red-600">Passwords do not match.</p>
              )}
              {!!password && !passwordValid && (
                <p className="mt-2 text-xs text-red-600">Password must be at least 6 characters.</p>
              )}
            </div>
          </div>
        </div>

        {error && (
          <div className="mt-3 text-sm text-red-600">{error}</div>
        )}

        <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between mt-6 gap-3">
          <div>
            <Button type="button" variant="destructive" onClick={handleDelete} className="h-10">Delete user</Button>
          </div>
          <div className="flex justify-end gap-3">
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
    </Dialog> 
  );
}
