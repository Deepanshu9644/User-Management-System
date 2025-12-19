import React from 'react';

export function SkeletonRow() {
  return (
    <div className="card" style={{ padding: 16 }}>
      <div className="skel" style={{ height: 14, width: '40%', marginBottom: 10 }} />
      <div className="skel" style={{ height: 12, width: '70%', marginBottom: 12 }} />
      <div className="skel" style={{ height: 12, width: '55%' }} />
    </div>
  );
}

export function SkeletonTable() {
  return (
    <div className="card" style={{ padding: 16 }}>
      <div className="skel" style={{ height: 18, width: '24%', marginBottom: 12 }} />
      <div className="grid">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="skel" style={{ height: 38, width: '100%' }} />
        ))}
      </div>
    </div>
  );
}
