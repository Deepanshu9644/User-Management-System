import React from 'react';

export default function Select({ className = '', ...props }) {
  return <select className={`select ${className}`} {...props} />;
}
