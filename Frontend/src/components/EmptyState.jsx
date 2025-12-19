import React from 'react';
import Button from './Button';
import { useNavigate } from 'react-router-dom';

export default function EmptyState({ title = 'No users found', subtitle = 'Try changing search or add a new user.' }) {
  const nav = useNavigate();
  return (
    <div className="card" style={{ padding: 18, textAlign: 'center' }}>
      <h3 style={{ margin: 0 }}>{title}</h3>
      <p style={{ margin: '8px 0 14px', color: 'var(--muted)' }}>{subtitle}</p>
      <Button variant="primary" onClick={() => nav('/users/new')}>Add User</Button>
    </div>
  );
}
