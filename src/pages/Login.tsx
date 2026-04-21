import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LogIn } from 'lucide-react';

const credentials = [
  { role: 'Archbishop', username: 'archbishop', password: 'admin123' },
  { role: 'Auxiliary Bishop', username: 'auxbishop', password: 'bishop123' },
  { role: 'Chancellor', username: 'chancellor', password: 'chancellor123' },
  { role: 'Priest', username: 'priest', password: 'priest123' },
  { role: 'Parishioner', username: 'faithful', password: 'faith123' },
];

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const err = await login(username, password);
      if (err) {
        setError(err);
        setLoading(false);
      } else {
        console.log('Login successful, navigating to dashboard...');
        navigate('/dashboard', { replace: true });
      }
    } catch (err) {
      setError('An unexpected error occurred');
      setLoading(false);
    }
  };

  const quickLogin = async (u: string, p: string) => {
    setUsername(u);
    setPassword(p);
    setLoading(true);
    
    try {
      const err = await login(u, p);
      if (!err) {
        console.log('Quick login successful, navigating to dashboard...');
        navigate('/dashboard', { replace: true });
      }
    } catch (err) {
      setError('Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center px-4">
      <div className="cathedral-bg" />

      <div className="w-full max-w-sm animate-float-in">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-medium tracking-tight mb-1">
            Archdiocese of Abuja
          </h1>
          <p className="text-sm text-muted-foreground font-ui">
            Church Management System
          </p>
        </div>

        {/* Login Form */}
        <div className="glass-card mb-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs text-muted-foreground font-ui mb-1.5 block">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={e => { setUsername(e.target.value); setError(''); }}
                className="w-full bg-secondary/50 border border-border rounded-lg px-3 py-2.5 text-sm text-foreground font-ui placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
                placeholder="Enter username"
                disabled={loading}
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground font-ui mb-1.5 block">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={e => { setPassword(e.target.value); setError(''); }}
                className="w-full bg-secondary/50 border border-border rounded-lg px-3 py-2.5 text-sm text-foreground font-ui placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
                placeholder="Enter password"
                disabled={loading}
              />
            </div>

            {error && (
              <p className="text-xs text-destructive font-ui">{error}</p>
            )}

            <button
              type="submit"
              className="btn-gold !mt-5 flex items-center justify-center gap-2 w-full"
              disabled={loading}
            >
              {loading ? (
                <span>Loading...</span>
              ) : (
                <>
                  <LogIn size={16} />
                  <span>Sign In</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Demo Credentials */}
        <div className="glass-card !p-3">
          <p className="text-[0.65rem] text-muted-foreground font-ui uppercase tracking-wider mb-2.5">
            Demo Credentials
          </p>
          <div className="space-y-1.5">
            {credentials.map(c => (
              <button
                key={c.role}
                onClick={() => quickLogin(c.username, c.password)}
                disabled={loading}
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-left hover:bg-secondary/50 transition-colors group disabled:opacity-50"
              >
                <span className="text-xs text-foreground/80 font-ui">{c.role}</span>
                <span className="text-[0.65rem] text-muted-foreground font-ui group-hover:text-primary transition-colors">
                  {c.username} / {c.password}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;