import { useContext } from 'react';
import { Sun, Moon } from 'lucide-react';
import { ThemeContext } from '../../App';

export default function Header({ title, subtitle, children }) {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <header className="header">
      <div>
        <div className="header-title">{title}</div>
        {subtitle && <div className="header-subtitle">{subtitle}</div>}
      </div>
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
        {children}
        <button
          className="btn-icon"
          onClick={toggleTheme}
          title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>
    </header>
  );
}
