import React from 'react';
import { Link, useLocation } from 'react-router-dom';


export default function Navbar() {
  const location = useLocation();

  return (
    <nav className="navbar">
      <Link
        to="/"
        className={location.pathname === '/' ? 'active' : ''}
      >
        Add User
      </Link>
      <Link
        to="/user-list"
        className={location.pathname === '/user-list' ? 'active' : ''}
      >
        User List
      </Link>
    </nav>
  );
}
