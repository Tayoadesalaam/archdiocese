import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Menu, X, LogOut, User, Church } from 'lucide-react';
import { NavLink } from './NavLink';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/parishes', label: 'Parishes' },
  { to: '/events', label: 'Events' },
  { to: '/contact', label: 'Contact' },
];

const Navbar: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-md">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4 sm:px-6 h-14">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 text-foreground group">
          <Church className="w-5 h-5 text-gold group-hover:text-gold/80 transition-colors" strokeWidth={1.5} />
          <span className="font-display text-sm tracking-tight">Abuja Archdiocese</span>
        </Link>

        {/* Desktop nav */}
        <ul className="hidden md:flex items-center gap-1">
          {navLinks.map(l => (
            <li key={l.to}>
              <Link
                to={l.to}
                className="px-3 py-1.5 rounded-md text-xs font-ui text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors"
              >
                {l.label}
              </Link>
            </li>
          ))}

          {isAuthenticated && user ? (
            <>
              <li>
                <Link
                  to="/dashboard"
                  className="px-3 py-1.5 rounded-md text-xs font-ui text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors"
                >
                  Dashboard
                </Link>
              </li>
              <li className="ml-2 flex items-center gap-2">
                <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-secondary/30">
                  <User size={14} className="text-gold" strokeWidth={1.5} />
                  <span className="text-xs font-ui text-foreground">
                    {user.firstName}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-3 py-1.5 rounded-md text-xs font-ui text-muted-foreground hover:text-foreground hover:bg-secondary/50 border border-border/50 transition-colors flex items-center gap-1"
                >
                  <LogOut size={14} strokeWidth={1.5} />
                  <span>Logout</span>
                </button>
              </li>
            </>
          ) : (
            <li className="ml-2">
              <Link
                to="/login"
                className="btn-gold !w-auto !mt-0 !py-1.5 !px-4 !text-xs"
              >
                Login
              </Link>
            </li>
          )}
        </ul>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-muted-foreground hover:text-foreground transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border/50 bg-background/95 backdrop-blur-md px-4 py-3 space-y-1 animate-float-in">
          {navLinks.map(l => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setMobileOpen(false)}
              className="block px-3 py-2 rounded-md text-sm font-ui text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors"
            >
              {l.label}
            </Link>
          ))}
          {isAuthenticated && user ? (
            <>
              <Link
                to="/dashboard"
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-2 rounded-md text-sm font-ui text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors"
              >
                Dashboard
              </Link>
              <button
                onClick={() => { handleLogout(); setMobileOpen(false); }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm font-ui text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors"
              >
                <LogOut size={14} strokeWidth={1.5} />
                <span>Logout ({user.firstName})</span>
              </button>
            </>
          ) : (
            <Link
              to="/login"
              onClick={() => setMobileOpen(false)}
              className="block px-3 py-2 rounded-md text-sm font-ui text-foreground"
            >
              Login
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;