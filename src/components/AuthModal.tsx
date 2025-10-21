import React, { useState } from 'react';
import { Dialog, DialogContent } from './ui/dialog';
import { Input } from './ui/input';
import { Button } from './ui/button';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: any) => void;
  message?: string | null;
}

export function AuthModal({ isOpen, onClose, onLoginSuccess, message }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      if (mode === 'login') {
        const { login } = await import('../lib/auth');
        const user = await login(username, password);
        // persist and broadcast login so other parts of the app can react
        try { localStorage.setItem('gowatch_user', JSON.stringify(user)); } catch {}
        window.dispatchEvent(new CustomEvent('gowatch:login', { detail: user }));
        onLoginSuccess && onLoginSuccess(user);
      } else {
        const { signup } = await import('../lib/auth');
        const user = await signup(username, password);
        try { localStorage.setItem('gowatch_user', JSON.stringify(user)); } catch {}
        window.dispatchEvent(new CustomEvent('gowatch:login', { detail: user }));
        onLoginSuccess && onLoginSuccess(user);
      }
      onClose();
    } catch (err: any) {
      setError(err?.response?.data?.error || err?.message || 'Auth failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open: boolean) => !open && onClose()}>
      <DialogContent className="w-80">
        <div className="p-6 w-full">
          {message && (
            <div className="mb-3 p-3 rounded bg-yellow-50 text-sm text-yellow-800 border border-yellow-100">{message}</div>
          )}
          <h3 className="text-lg font-semibold mb-4">{mode === 'login' ? 'Sign in' : 'Create account'}</h3>
          <div className="space-y-2">
            <Input placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
            <Input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            {error && <div className="text-sm text-red-500">{error}</div>}
            <div className="flex items-center justify-between">
              <Button onClick={handleSubmit} disabled={loading}>{mode === 'login' ? 'Sign in' : 'Create'}</Button>
              <Button variant="ghost" onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}>{mode === 'login' ? 'Create account' : 'Have an account?'}</Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
