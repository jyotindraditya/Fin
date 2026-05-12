import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Receipt, Tag, Settings, LogOut, User } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const links = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/expenses', label: 'Expenses', icon: Receipt },
  { to: '/categories', label: 'Categories', icon: Tag },
  { to: '/settings', label: 'Settings', icon: Settings },
];

export default function Sidebar() {
  const { user, logout } = useAuth();

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <h1>Fin</h1>
      </div>

      <nav className="sidebar-nav">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `sidebar-link${isActive ? ' active' : ''}`
            }
            end={to === '/'}
          >
            <Icon size={20} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="sidebar-user-avatar">
            <User size={16} />
          </div>
          <span className="sidebar-user-name">{user}</span>
        </div>
        <button className="sidebar-link sidebar-logout" onClick={logout}>
          <LogOut size={20} />
          Log Out
        </button>
      </div>
    </aside>
  );
}
