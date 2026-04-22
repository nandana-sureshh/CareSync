import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <NavLink to="/" className="navbar-brand" style={{ textDecoration: 'none' }}>
        <span className="brand-icon">🏥</span>
        CareSync
      </NavLink>

      {isAuthenticated && (
        <div className="navbar-nav">
          <NavLink
            to="/dashboard"
            className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/doctors"
            className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
          >
            Doctors
          </NavLink>
          <NavLink
            to="/book"
            className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
          >
            Book
          </NavLink>
          <NavLink
            to="/appointments"
            className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
          >
            Appointments
          </NavLink>
          <div
            style={{
              width: 1,
              height: 24,
              background: 'var(--color-border)',
              margin: '0 8px',
            }}
          />
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                background: 'var(--gradient-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 12,
                fontWeight: 700,
                color: '#fff',
              }}
            >
              {user?.email?.[0]?.toUpperCase() || 'U'}
            </div>
            <button
              onClick={handleLogout}
              className="btn btn-secondary btn-sm"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
