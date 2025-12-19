import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Button from '../components/Button';
import Modal from '../components/Modal';
import { deleteUser, getUser } from '../api/users';
import { normalizeApiError } from '../api/http';
import { useToast } from '../components/ToastProvider';
import { initials } from '../utils/helpers';
import { SkeletonRow } from '../components/Skeleton';

export default function UserDetails() {
  const { id } = useParams();
  const nav = useNavigate();
  const toast = useToast();

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [notFound, setNotFound] = useState(false);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function run() {
      setLoading(true);
      setNotFound(false);
      try {
        const res = await getUser(id);
        if (!mounted) return;
        setUser(res.data);
      } catch (e) {
        const apiErr = normalizeApiError(e);
        if (!mounted) return;
        setNotFound(true);
        toast.error(apiErr.message || 'User not found');
      } finally {
        if (mounted) setLoading(false);
      }
    }
    run();
    return () => { mounted = false; };
  }, [id, toast]);

  async function onConfirmDelete() {
    setDeleting(true);
    try {
      await deleteUser(id);
      toast.success('User deleted successfully');
      nav('/users');
    } catch (e) {
      const apiErr = normalizeApiError(e);
      toast.error(apiErr.message || 'Delete failed');
    } finally {
      setDeleting(false);
      setConfirmOpen(false);
    }
  }

  if (loading) return <SkeletonRow />;

  if (notFound || !user) {
    return (
      <div className="card" style={{ padding: 18 }}>
        <h3 style={{ margin: 0 }}>User not found</h3>
        <p style={{ color: 'var(--muted)' }}>The requested user does not exist.</p>
        <Button onClick={() => nav('/users')}>Back to Users</Button>
      </div>
    );
  }

  const addr = user.address || {};
  const geo = addr.geo || {};

  return (
    <div className="grid" style={{ gap: 16 }}>
      <div className="row" style={{ justifyContent: 'space-between' }}>
        <div>
          <h1 className="sectionTitle" style={{ marginBottom: 0 }}>User Details</h1>
          <p className="sectionSub">Read-only profile layout</p>
        </div>
        <Button onClick={() => nav('/users')}>Back to Users</Button>
      </div>

      <div className="card" style={{ padding: 18 }}>
        <div className="row" style={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div className="row" style={{ gap: 14 }}>
            <div className="brandLogo" style={{ width: 56, height: 56, borderRadius: 18 }}>
              {initials(user.name)}
            </div>
            <div>
              <div style={{ fontWeight: 900, fontSize: 20 }}>{user.name}</div>
              <div style={{ color: 'var(--muted)' }}>{user.email}</div>
              <div style={{ color: 'var(--muted)', marginTop: 4 }}>{user.phone}</div>
              <div style={{ marginTop: 8 }}><span className="badge">{user.company}</span></div>
            </div>
          </div>

          <div className="row">
            <Button onClick={() => nav(`/users/${id}/edit`)}>Edit</Button>
            <Button variant="danger" onClick={() => setConfirmOpen(true)}>Delete</Button>
          </div>
        </div>

        <div style={{ height: 16 }} />

        <div className="card" style={{ padding: 16, boxShadow: 'none' }}>
          <div style={{ fontWeight: 900, marginBottom: 10 }}>Address</div>
          <div className="grid" style={{ gap: 8, color: 'var(--muted)' }}>
            <div>Street: <span style={{ color: 'var(--text)' }}>{addr.street || '-'}</span></div>
            <div>City: <span style={{ color: 'var(--text)' }}>{addr.city || '-'}</span></div>
            <div>Zip: <span style={{ color: 'var(--text)' }}>{addr.zipcode || '-'}</span></div>
            <div>Geo: <span style={{ color: 'var(--text)' }}>{geo.lat ?? '-'}, {geo.lng ?? '-'}</span></div>
          </div>
        </div>
      </div>

      <Modal open={confirmOpen} title="Delete user?" onClose={() => (deleting ? null : setConfirmOpen(false))}>
        <p style={{ marginTop: 6, color: 'var(--muted)' }}>This action cannot be undone.</p>
        <div className="row" style={{ justifyContent: 'flex-end', marginTop: 14 }}>
          <Button onClick={() => setConfirmOpen(false)} disabled={deleting}>Cancel</Button>
          <Button variant="danger" onClick={onConfirmDelete} disabled={deleting}>
            {deleting ? 'Deleting...' : 'Delete'}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
