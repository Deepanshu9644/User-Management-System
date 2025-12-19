import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import Select from '../components/Select';
import Button from '../components/Button';
import Modal from '../components/Modal';
import EmptyState from '../components/EmptyState';
import Pagination from '../components/Pagination';
import UserCard from '../components/UserCard';
import { SkeletonTable } from '../components/Skeleton';

import { deleteUser, listUsers } from '../api/users';
import { normalizeApiError } from '../api/http';
import { useToast } from '../components/ToastProvider';

import IconButton from "../components/IconButton";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { initials } from "../utils/helpers";

export default function UsersList() {
  const nav = useNavigate();
  const toast = useToast();

  const [params, setParams] = useSearchParams();
  const search = params.get('search') || '';
  const sortUi = params.get('sort') || 'recent';
  const page = Number(params.get('page') || 1);
  const limit = Number(params.get('limit') || 10);

  const [companyFilter, setCompanyFilter] = useState('all');

  const [loading, setLoading] = useState(true);
  const [errMsg, setErrMsg] = useState('');
  const [users, setUsers] = useState([]);
  const [meta, setMeta] = useState({ total: 0, page, limit });

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const sortParam = useMemo(() => {
    if (sortUi === 'az') return 'name';
    if (sortUi === 'za') return '-name';
    return '-createdAt';
  }, [sortUi]);

  const companies = useMemo(() => {
    const set = new Set(users.map((u) => u?.company).filter(Boolean));
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [users]);

  const visibleUsers = useMemo(() => {
    if (companyFilter === 'all') return users;
    return users.filter((u) => u.company === companyFilter);
  }, [users, companyFilter]);

  function setQuery(next) {
    const p = new URLSearchParams(params);
    Object.entries(next).forEach(([k, v]) => {
      if (v === undefined || v === null || v === '') p.delete(k);
      else p.set(k, String(v));
    });
    setParams(p);
  }

  useEffect(() => {
    let mounted = true;

    async function run() {
      setLoading(true);
      setErrMsg('');
      try {
        const data = await listUsers({ search, sort: sortParam, page, limit });
        if (!mounted) return;

        setUsers(data?.data || []);
        setMeta(data?.meta || { total: (data?.data || []).length, page, limit });
      } catch (e) {
        const apiErr = normalizeApiError(e);
        if (!mounted) return;
        setErrMsg(apiErr.message || 'Failed to load users');
        toast.error(apiErr.message || 'Failed to load users');
      } finally {
        if (mounted) setLoading(false);
      }
    }

    run();
    return () => { mounted = false; };
  }, [search, sortParam, page, limit, toast]);

  async function onConfirmDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteUser(deleteTarget.id);
      toast.success('User deleted successfully');
      setConfirmOpen(false);
      setDeleteTarget(null);

      const data = await listUsers({ search, sort: sortParam, page, limit });
      setUsers(data?.data || []);
      setMeta(data?.meta || meta);
    } catch (e) {
      const apiErr = normalizeApiError(e);
      toast.error(apiErr.message || 'Delete failed');
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="grid" style={{ gap: 16 }}>
      <div>
        <h1 className="sectionTitle" style={{ marginBottom: 0 }}>Users</h1>
        <p className="sectionSub">Manage users (create, view, edit, delete)</p>
      </div>

      <div className="row">
        <Select value={sortUi} onChange={(e) => setQuery({ sort: e.target.value, page: 1 })}>
          <option value="recent">Recently Added</option>
          <option value="az">Name A–Z</option>
          <option value="za">Name Z–A</option>
        </Select>

        <Select value={companyFilter} onChange={(e) => setCompanyFilter(e.target.value)}>
          <option value="all">All companies</option>
          {companies.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </Select>

        <div className="spacer" />

        <span className="badge">
          Total Users: {meta?.total ?? users.length}
        </span>
      </div>

      {errMsg ? (
        <div className="card" style={{ padding: 14, borderColor: 'rgba(239,68,68,0.35)' }}>
          <div style={{ fontWeight: 800, color: 'var(--danger-600)' }}>Error</div>
          <div style={{ color: 'var(--muted)', marginTop: 6 }}>{errMsg}</div>
        </div>
      ) : null}

      {loading ? (
        <SkeletonTable />
      ) : visibleUsers.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          {/* Desktop table */}
          <div className="card desktopOnly">
            <div className="tableWrap">
              <table className="table">
                <thead>
                  <tr>
                    <th>Name</th><th>Email</th><th>Phone</th><th>Company</th><th>City</th><th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {visibleUsers.map((u) => (
                    <tr key={u.id}>
                      {/* NAME with avatar */}
                      <td>
                        <div className="nameCell">
                          <div className="nameAvatar">{initials(u.name)}</div>
                          <div className="nameText">{u.name}</div>
                        </div>
                      </td>

                      <td>{u.email}</td>
                      <td>{u.phone}</td>

                      {/* Company pill */}
                      <td><span className="companyPill">{u.company}</span></td>

                      <td>{u?.address?.city || '-'}</td>

                      {/* Actions icons */}
                      <td>
                        <div className="actionsCell">
                          <IconButton title="View" onClick={() => nav(`/users/${u.id}`)}>
                            <Eye size={18} />
                          </IconButton>

                          <IconButton title="Edit" onClick={() => nav(`/users/${u.id}/edit`)}>
                            <Pencil size={18} />
                          </IconButton>

                          <IconButton
                            title="Delete"
                            variant="danger"
                            onClick={() => {
                              setDeleteTarget(u);
                              setConfirmOpen(true);
                            }}
                          >
                            <Trash2 size={18} />
                          </IconButton>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={{ padding: 14 }}>
              <Pagination
                page={meta.page || page}
                total={meta.total || 0}
                limit={meta.limit || limit}
                onChange={(p) => setQuery({ page: p })}
              />
            </div>
          </div>

          {/* Mobile cards */}
          <div className="grid mobileOnly" style={{ gridTemplateColumns: '1fr' }}>
            {visibleUsers.map((u) => (
              <UserCard
                key={u.id}
                user={u}
                onView={() => nav(`/users/${u.id}`)}
                onEdit={() => nav(`/users/${u.id}/edit`)}
                onDelete={() => {
                  setDeleteTarget(u);
                  setConfirmOpen(true);
                }}
              />
            ))}

            <Pagination
              page={meta.page || page}
              total={meta.total || 0}
              limit={meta.limit || limit}
              onChange={(p) => setQuery({ page: p })}
            />
          </div>
        </>
      )}

      <Modal
        open={confirmOpen}
        title="Delete user?"
        onClose={() => (deleting ? null : setConfirmOpen(false))}
      >
        <p style={{ marginTop: 6, color: 'var(--muted)' }}>
          This action cannot be undone.
        </p>

        <div className="row" style={{ justifyContent: 'flex-end', marginTop: 14 }}>
          <Button onClick={() => setConfirmOpen(false)} disabled={deleting}>
            Cancel
          </Button>
          <Button variant="danger" onClick={onConfirmDelete} disabled={deleting}>
            {deleting ? 'Deleting...' : 'Delete'}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
