import React from 'react';
import { Link } from 'react-router-dom';


export default function Sidebar() {
  return (
    <aside className="sidebar">
      <h3>Menu</h3>
      <Link to="/">Dashboard</Link>
      <Link to="/settings">Settings</Link>
    </aside>
  );
}
