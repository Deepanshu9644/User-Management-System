import React from 'react';
import Button from './Button';
import Input from './Input';

export default function TopBar({
  title = 'User Management Dashboard',
  searchValue,
  onSearchChange,
  onAddUser,
  onToggleMenu
}) {
  return (
    <header className="topbar">
      <div className="topbarInner">
        <Button className="mobileOnly" onClick={onToggleMenu} aria-label="Open menu">☰</Button>

        <div className="topTitle topTitleBlue">{title}</div>

        <div className="spacer" />

        <Input
          value={searchValue}
          onChange={(e) => onSearchChange?.(e.target.value)}
          placeholder="Search by name or email..."
          style={{ width: 360, maxWidth: '46vw' }}
        />

        <Button variant="primary" onClick={onAddUser}>
          + Add User
        </Button>
      </div>
    </header>
  );
}
