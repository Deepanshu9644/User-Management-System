import React from 'react';
import { NavLink } from 'react-router-dom';

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brandLogo">UM</div>
        <div>
         <div className="brandTitle brandTitleBlue">User Management Dashboard</div>
          <div style={{ color: 'var(--muted)', fontSize: 12 }}>Admin</div>
        </div>
      </div>

      <nav className="grid" style={{ gap: 8 }}>
        <NavLink to="/users" className={({ isActive }) => `navItem ${isActive ? 'active' : ''}`}>
          <span aria-hidden>👥</span>
          <span>Users</span>
        </NavLink>
      </nav>
    </aside>
  );
}
