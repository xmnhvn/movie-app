import React, { useState } from 'react';
import { Dialog } from './ui/dialog';
import { Input } from './ui/input';
import { Button } from './ui/button';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: any) => void;
}

export function AuthModal({ isOpen, onClose, onLoginSuccess }: AuthModalProps) {
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
        onLoginSuccess(user);
      } else {
        const { signup } = await import('../lib/auth');
        const user = await signup(username, password);
        onLoginSuccess(user);
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
      <div className="p-6 w-80">
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
    </Dialog>
  );
}
