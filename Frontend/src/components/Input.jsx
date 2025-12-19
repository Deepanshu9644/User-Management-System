import React from 'react';

export default function Input({ error, className = '', ...props }) {
  return <input className={`input ${error ? 'inputError' : ''} ${className}`} {...props} />;
}
