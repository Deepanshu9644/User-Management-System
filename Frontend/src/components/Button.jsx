import React from 'react';

export default function Button({ variant = 'default', className = '', ...props }) {
  const cls =
    variant === 'primary'
      ? 'btn btnPrimary'
      : variant === 'danger'
      ? 'btn btnDanger'
      : variant === 'ghost'
      ? 'btn btnGhost'
      : 'btn';

  return <button className={`${cls} ${className}`} {...props} />;
}
