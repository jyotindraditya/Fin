import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { DollarSign, User, Lock, ArrowRight } from 'lucide-react';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isLogin) {
        await login(username, password);
      } else {
        await register(username, password);
      }
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError('');
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-brand">
          <h1 className="brand-title">Fin</h1>
        </div>

        <h2 className="auth-title">{isLogin ? 'Welcome back' : 'Create account'}</h2>
        <p className="auth-subtitle">
          {isLogin ? 'Sign in to manage your finances' : 'Start tracking your expenses today'}
        </p>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Username</label>
            <div className="auth-input-wrapper">
              <User size={16} className="auth-input-icon" />
              <input
                type="text"
                className="form-input auth-input"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                minLength={3}
                maxLength={50}
                autoFocus
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="auth-input-wrapper">
              <Lock size={16} className="auth-input-icon" />
              <input
                type="password"
                className="form-input auth-input"
                placeholder={isLogin ? 'Enter your password' : 'Min 6 characters'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary auth-btn" disabled={loading}>
            {loading ? 'Please wait...' : isLogin ? 'Sign In' : 'Sign Up'}
            {!loading && <ArrowRight size={16} />}
          </button>
        </form>

        <p className="auth-toggle">
          {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
          <button type="button" onClick={toggleMode} className="auth-toggle-btn">
            {isLogin ? 'Sign Up' : 'Sign In'}
          </button>
        </p>
      </div>
    </div>
  );
}
