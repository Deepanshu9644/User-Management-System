import React from 'react';
import Button from './Button';

export default function Pagination({ page, total, limit, onChange }) {
  const totalPages = Math.max(1, Math.ceil((total || 0) / (limit || 10)));
  const canPrev = page > 1;
  const canNext = page < totalPages;

  return (
    <div className="row" style={{ justifyContent: 'space-between', marginTop: 12 }}>
      <span className="badge">
        Page {page} of {totalPages} • Total {total || 0}
      </span>

      <div className="row">
        <Button disabled={!canPrev} onClick={() => onChange(page - 1)}>Prev</Button>
        <Button disabled={!canNext} onClick={() => onChange(page + 1)}>Next</Button>
      </div>
    </div>
  );
}
