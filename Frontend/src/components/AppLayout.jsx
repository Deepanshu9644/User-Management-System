import React, { useMemo, useState } from 'react';
import { Outlet, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import Sidebar from './Sidebar';
import Drawer from './Drawer';
import TopBar from './TopBar';

export default function AppLayout() {
  const nav = useNavigate();
  const loc = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const [params, setParams] = useSearchParams();
  const topSearch = params.get('search') || '';

  const showSearch = useMemo(() => loc.pathname.startsWith('/users'), [loc.pathname]);

  function setSearch(v) {
    const next = new URLSearchParams(params);
    if (!v) next.delete('search');
    else next.set('search', v);
    // reset paging
    next.delete('page');
    setParams(next);
  }

  return (
    <div className="appShell">
      <Sidebar />

      <div className="main">
        <TopBar
          searchValue={showSearch ? topSearch : ''}
          onSearchChange={showSearch ? setSearch : undefined}
          onAddUser={() => nav('/users/new')}
          onToggleMenu={() => setDrawerOpen(true)}
        />

        <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />

        <main className="container">
          <Outlet />
        </main>

        <div className="bottomNav">
          <div className="bottomNavInner">
            <a href="/users" className="navItem active" style={{ padding: '10px 12px' }}>
              👥 Users
            </a>
            <button className="kebab" onClick={() => nav('/users/new')}>＋ Add</button>
          </div>
        </div>

        <button className="fab" onClick={() => nav('/users/new')} aria-label="Add user">
          +
        </button>
      </div>
    </div>
  );
}
