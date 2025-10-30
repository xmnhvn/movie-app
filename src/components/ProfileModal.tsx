import React, { useMemo, useRef, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
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
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(user?.avatarUrl || null);
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
    setAvatarRemoved(false);
  };

  const handleRemoveAvatar = () => {
    setAvatarPreview(null);
    setAvatarFile(null);
    setAvatarRemoved(true);
  };

  const usernameChanged = (username || '').trim() !== (rawName || '');
  const passwordValid = !password || password.length >= 6;
  const passwordsMatch = !password || password === confirmPassword;
  const isDirty = usernameChanged || !!password || !!avatarFile || avatarRemoved;
  const canSave = isDirty && passwordValid && passwordsMatch && !saving;

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
      <DialogContent className="w-[530px] min-w-[530px] max-w-[530px] px-8 py-6 overflow-visible">
        <DialogHeader>
          <DialogTitle className="text-xl text-center">Edit profile</DialogTitle>
          <DialogDescription className="text-base text-center">
            Update your information and profile photo.
          </DialogDescription>
        </DialogHeader>

          <div className="mt-1">
          <Label className="block text-center text-sm font-medium mb-2">Profile photo</Label>
          <div className="relative mx-auto mb-3 h-[160px] w-[160px]">
            <Avatar className="size-full">
              <AvatarImage src={avatarPreview || ''} alt={displayName} />
              <AvatarFallback className="bg-sky-500/90 text-white text-lg">
                {initials}
              </AvatarFallback>
            </Avatar>
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={onAvatarChange} />
          </div>
          <div className="flex items-center justify-center gap-3">
            <Button type="button" variant="outline" size="sm" onClick={onPickAvatar}>Change photo</Button>
            {avatarPreview && (
              <Button type="button" variant="ghost" size="sm" onClick={handleRemoveAvatar} className="text-red-600 hover:text-red-700">
                Remove
              </Button>
            )}
          </div>
        </div>

        {/* Form fields */}
        <div className="space-y-4 mt-5">
          <div className="space-y-2">
            <Label htmlFor="profile-username" className="text-sm font-medium">Username</Label>
            <Input
              id="profile-username"
              value={username}
              placeholder="Mona"
              onChange={(e) => setUsername(e.target.value)}
              className="h-10 rounded-lg text-base"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="profile-password" className="text-sm font-medium">New password</Label>
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
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
            <p className="text-xs text-muted-foreground">Leave blank to keep your current password.</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="profile-password-confirm" className="text-sm font-medium">Confirm password</Label>
            <Input
              id="profile-password-confirm"
              type={showPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="********"
              className="h-10 rounded-lg text-base"
            />
            {!!password && !passwordsMatch && (
              <p className="text-xs text-red-600">Passwords do not match.</p>
            )}
            {!!password && !passwordValid && (
              <p className="text-xs text-red-600">Password must be at least 6 characters.</p>
            )}
          </div>
        </div>

        {error && (
          <div className="mt-3 text-sm text-red-600">{error}</div>
        )}

        {/* Actions */}
        <div className="flex justify-end mt-6 gap-3">
          <Button
            onClick={onClose}
            variant="outline"
            className="px-4 h-10 rounded-lg"
            disabled={saving}
          >
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
      </DialogContent>
    </Dialog>
  );
}
