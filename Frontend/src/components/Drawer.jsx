import React from 'react';
import Sidebar from './Sidebar';

export default function Drawer({ open, onClose }) {
  if (!open) return null;
  return (
    <>
      <div className="drawerOverlay" onMouseDown={onClose} />
      <div className="drawer">
        <div className="row" style={{ justifyContent: 'space-between' }}>
          <div style={{ fontWeight: 800 }}>Menu</div>
          <button className="kebab" onClick={onClose} aria-label="Close drawer">✕</button>
        </div>
        <div style={{ marginTop: 10 }}>
          <Sidebar />
        </div>
      </div>
    </>
  );
}
