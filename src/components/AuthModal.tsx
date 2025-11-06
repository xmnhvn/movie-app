import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Alert, AlertDescription } from './ui/alert';
import { Eye, EyeOff, Info, AlertTriangle } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: any) => void;
  message?: string | null;
  initialMode?: 'login' | 'signup';
}

export function AuthModal({ isOpen, onClose, onLoginSuccess, message, initialMode = 'login' }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  React.useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
    }
  }, [isOpen, initialMode]);

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      if (!username || !password) {
        throw new Error('Please enter username and password');
      }
      if (mode === 'signup' && password.length < 6) {
        throw new Error('Password must be at least 6 characters');
      }
      if (mode === 'login') {
        const { login } = await import('../lib/auth');
        const user = await login(username, password);
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
      setError(
        err?.response?.data?.error || err?.response?.data?.stack || err?.message || 'Auth failed'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open: boolean) => { if (!open) onClose(); }}>
  <DialogContent className="w-[430px] min-w-[430px] max-w-[430px] h-[520px] px-8 py-6 overflow-hidden [&_[data-slot='dialog-close']]:hidden">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center">
            {mode === 'login' ? 'Welcome back' : 'Create your account'}
          </DialogTitle>
          <DialogDescription className="text-xl text-center">
            {mode === 'login'
              ? 'Sign in to continue to GoWatch and start saving your favorites on your watchlist.'
              : 'Sign up to begin with GoWatch and start saving favorites to your list today online.'}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-1 min-h-0 overflow-y-auto space-y-3">
          {message && (
            <Alert>
              <Info className="mt-0" />
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Tabs value={mode} onValueChange={(v: string) => setMode((v as 'login' | 'signup'))}>
            <TabsList className="w-full">
              <TabsTrigger value="login">Sign in</TabsTrigger>
              <TabsTrigger value="signup">Create account</TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="mt-2 min-h-[260px]">
                <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="auth-username" className="text-sm font-medium">Username</Label>
                  <Input
                    id="auth-username"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="h-10 rounded-lg text-base"
                  />
                </div>
                <div className="space-y-2 mt-2">
                  <Label htmlFor="auth-password" className="text-sm font-medium">Password</Label>
                  <div className="relative">
                    <Input
                      id="auth-password"
                      placeholder="Password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-10 rounded-lg pr-12 text-base"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute mt-2 inset-y-0 right-2 grid w-8 place-items-center rounded-none hover:bg-transparent"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <Button onClick={onClose} variant="outline" className="h-10 rounded-lg w-full" disabled={loading}>
                    Cancel
                  </Button>
                  <Button onClick={handleSubmit} disabled={loading} className="h-10 rounded-lg w-full bg-black text-white hover:bg-black/90">
                    {loading ? 'Signing in…' : 'Sign in'}
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="signup" className="mt-2 min-h-[260px]">
                <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="auth-username-signup" className="text-sm font-medium">Username</Label>
                  <Input
                    id="auth-username-signup"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="h-10 rounded-lg text-base"
                  />
                </div>
                <div className="space-y-2 mt-2">
                  <Label htmlFor="auth-password-signup" className="text-sm font-medium">Password</Label>
                  <div className="relative">
                    <Input
                      id="auth-password-signup"
                      placeholder="••••••••"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-10 rounded-lg pr-12 text-base"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute mt-2 inset-y-0 right-1 grid w-8 place-items-center rounded-none hover:bg-transparent"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
                    </button>
                  </div>
                  {password && password.length < 6 && (
                    <div className="relative">
                      <div className="absolute left-1/2 -translate-x-1/2 top-full mt-1 z-50 animate-fade-in">
                        <div className="relative rounded-md border border-gray-300 bg-white text-gray-900 text-sm px-3 py-2 shadow-[0_2px_8px_rgba(0,0,0,0.12)] w-max max-w-[280px]">
                          <div className="flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4 text-yellow-600" />
                            <span>Password must be at least 6 characters.</span>
                          </div>
                          <div className="absolute left-1/2 -translate-x-1/2 top-0 -translate-y-1/2 h-3 w-3 rotate-45 bg-white border-t border-l border-gray-300"></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <Button onClick={onClose} variant="outline" className="h-10 rounded-lg w-full" disabled={loading}>
                    Cancel
                  </Button>
                  <Button onClick={handleSubmit} disabled={loading || password.length < 6} className="h-10 rounded-lg w-full bg-black text-white hover:bg-black/90">
                    {loading ? 'Creating…' : 'Create account'}
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}