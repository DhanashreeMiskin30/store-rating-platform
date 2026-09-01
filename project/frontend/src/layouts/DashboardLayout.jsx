import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Shared shell (sidebar + topbar) for admin / user / owner dashboards.
 * navItems: [{ to, label, icon }]
 */
export default function DashboardLayout({ navItems, title, children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const initials = user?.name
    ? user.name.trim().split(/\s+/).slice(0, 2).map((p) => p[0]).join('').toUpperCase()
    : '?';

  return (
    <div className="app-shell">
      <aside className={`sidebar${menuOpen ? ' open' : ''}`}>
        <div className="brand">
          <div className="mark">SR</div>
          <span>Store Rating</span>
        </div>
        <nav>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) => (isActive ? 'active' : '')}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-footer">
          <button className="navlink" onClick={handleLogout}>Logout</button>
        </div>
      </aside>

      <div className="main-area">
        <header className="topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button className="menu-toggle" onClick={() => setMenuOpen((v) => !v)}>☰</button>
            <h2>{title}</h2>
          </div>
          <div className="user-chip">
            <div className="avatar">{initials}</div>
            <div>
              <div style={{ fontWeight: 600 }}>{user?.name}</div>
              <div style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem' }}>{user?.role?.replace('_', ' ')}</div>
            </div>
          </div>
        </header>
        <main className="content">{children}</main>
      </div>
    </div>
  );
}
