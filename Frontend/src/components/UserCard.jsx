import React from 'react';
import Button from './Button';
import { initials } from '../utils/helpers';

export default function UserCard({ user, onView, onEdit, onDelete }) {
  const city = user?.address?.city || '-';
  return (
    <div className="card" style={{ padding: 14 }}>
      <div className="row" style={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div className="row" style={{ gap: 12 }}>
          <div className="brandLogo" style={{ width: 44, height: 44, borderRadius: 16 }}>
            {initials(user?.name)}
          </div>
          <div>
            <div style={{ fontWeight: 800 }}>{user?.name}</div>
            <div style={{ color: 'var(--muted)', fontSize: 13 }}>{user?.email}</div>
          </div>
        </div>

        <span className="badge">{user?.company || '-'}</span>
      </div>

      <div style={{ marginTop: 12, color: 'var(--muted)', fontSize: 13 }}>
        <div>Phone: {user?.phone || '-'}</div>
        <div>City: {city}</div>
      </div>

      <div className="row" style={{ marginTop: 12 }}>
        <Button onClick={onView}>View</Button>
        <Button onClick={onEdit}>Edit</Button>
        <Button variant="danger" onClick={onDelete}>Delete</Button>
      </div>
    </div>
  );
}
