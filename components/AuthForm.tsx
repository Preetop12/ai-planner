
import React, { useState } from 'react';
import { GraduationCap, Mail, Lock, User as UserIcon, Shield, ArrowRight, ChevronLeft, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { Role } from '../types';

interface AuthFormProps {
  onLogin: (email: string, password: string) => Promise<boolean>;
  onRegister: (role: Role, email: string, name: string, password: string) => Promise<boolean>;
  onBack: () => void;
}

const AuthForm: React.FC<AuthFormProps> = ({ onLogin, onRegister, onBack }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState<Role>('user');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      let success = false;
      if (isLogin) {
        success = await onLogin(email, password);
        if (!success) setError('Invalid email or password combination.');
      } else {
        if (name.length < 2) { setError('Please enter your full name.'); setLoading(false); return; }
        success = await onRegister(role, email, name, password);
        if (!success) setError('An account with this email already exists.');
      }
    } catch {
      setError('An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const inputBase = "pro-input w-full pl-12 pr-4 py-4 rounded-xl text-sm";

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative">
      <div
        className="max-w-md w-full rounded-[2.5rem] overflow-hidden glass"
        style={{
          boxShadow: '0 24px 64px rgba(0,0,0,0.3)'
        }}
      >
        {/* Header accent bar */}
        <div className="h-1 w-full" style={{ background: 'linear-gradient(90deg, #c4956a, #8b5a30, #c4956a)' }} />

        <div className="p-8 pb-4 relative text-center">
          <button
            onClick={onBack}
            className="absolute top-8 left-8 p-2 rounded-full transition-colors"
            style={{ color: 'var(--text-muted)' }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = 'var(--coffee)'}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)'}
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <div className="w-16 h-16 btn-primary rounded-[1.5rem] flex items-center justify-center mx-auto mb-5 rotate-3" style={{ color: '#fff8f0' }}>
            <GraduationCap className="w-9 h-9" />
          </div>
          <h1 className="font-display text-2xl font-bold mb-1" style={{ color: 'var(--cream)' }}>
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h1>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            {isLogin ? 'Access your intelligent study roadmap' : 'Join 50,000+ students mastering their studies'}
          </p>
        </div>

        {/* Role selector (register only) */}
        {!isLogin && (
          <div className="px-8 pt-4">
            <div className="flex p-1 rounded-xl gap-1" style={{ background: 'rgba(196,149,106,0.06)', border: '1px solid rgba(196,149,106,0.1)' }}>
              {(['user', 'admin'] as Role[]).map(r => (
                <button
                  key={r}
                  onClick={() => setRole(r)}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all"
                  style={role === r ? {
                    background: 'linear-gradient(135deg, rgba(196,149,106,0.2), rgba(139,90,48,0.1))',
                    color: 'var(--coffee)',
                    border: '1px solid rgba(196,149,106,0.3)'
                  } : { color: 'var(--text-dim)' }}
                >
                  {r === 'user' ? <UserIcon className="w-4 h-4" /> : <Shield className="w-4 h-4" />}
                  {r === 'user' ? 'Student' : 'Admin'}
                </button>
              ))}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-8 space-y-4">
          {error && (
            <div className="p-3 rounded-xl flex items-center gap-3 text-sm font-semibold" style={{ background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.2)', color: '#fca5a5' }}>
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          {!isLogin && (
            <div className="relative">
              <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-dim)' }} />
              <input type="text" placeholder="Full Name" className={inputBase} value={name} onChange={e => setName(e.target.value)} required />
            </div>
          )}

          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-dim)' }} />
            <input type="email" required placeholder="Email Address" className={inputBase} value={email} onChange={e => setEmail(e.target.value)} />
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-dim)' }} />
            <input type={showPassword ? 'text' : 'password'} required placeholder="Password" className={`${inputBase} pr-12`} value={password} onChange={e => setPassword(e.target.value)} />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 transition-colors" style={{ color: 'var(--text-dim)' }}>
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-4 rounded-2xl text-base flex items-center justify-center gap-3 disabled:opacity-60"
          >
            {loading ? 'Processing…' : (isLogin ? 'Sign In' : 'Create Account')}
            <ArrowRight className="w-5 h-5" />
          </button>

          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => { setIsLogin(!isLogin); setError(null); }}
              className="text-sm font-semibold transition-colors"
              style={{ color: 'var(--text-muted)' }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = 'var(--coffee)'}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)'}
            >
              {isLogin ? "Don't have an account? Create one" : 'Already have an account? Log in'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuthForm;
