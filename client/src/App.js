import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import FormPage from './pages/FormPage';
import UserListPage from './pages/UserListPage';
import SettingsPage from './pages/SettingsPage';
import './App.css';  // Import the CSS for styling

function App() {
  return (
    <Router>
      <div className="app-container">
       
        <aside className="sidebar">
          <h3>SELLER SATHI</h3>
          <ul>
            <li><Link to="/">Dashboard</Link></li>
            <li><Link to="/settings">Settings</Link></li>
          </ul>
        </aside>

        
        <div className="main-content">
         
          <nav className="navbar">
            <ul>
              <li><Link to="/">Add User</Link></li>
              <li><Link to="/user-list">User List</Link></li>
            </ul>
          </nav>

          
          <main className="page-content">
            <Routes>
              <Route path="/" element={<FormPage />} />
              <Route path="/user-list" element={<UserListPage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
