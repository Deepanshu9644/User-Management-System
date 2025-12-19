import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Button from '../components/Button';
import Input from '../components/Input';
import { getUser, updateUserPut } from '../api/users';
import { normalizeApiError } from '../api/http';
import { useToast } from '../components/ToastProvider';
import { validateUser } from '../utils/validators';
import { SkeletonRow } from '../components/Skeleton';

export default function UserEdit() {
  const { id } = useParams();
  const nav = useNavigate();
  const toast = useToast();

  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [values, setValues] = useState(null);
  const [touched, setTouched] = useState({});
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');

  const errors = useMemo(() => (values ? validateUser(values) : {}), [values]);
  const hasErrors = values ? Object.keys(errors).length > 0 : true;

  useEffect(() => {
    let mounted = true;
    async function run() {
      setLoading(true);
      setNotFound(false);
      try {
        const res = await getUser(id);
        if (!mounted) return;
        setValues(res.data);
      } catch (e) {
        const apiErr = normalizeApiError(e);
        if (!mounted) return;
        if (apiErr?.message?.toLowerCase().includes('not found')) setNotFound(true);
        toast.error(apiErr.message || 'Failed to load user');
      } finally {
        if (mounted) setLoading(false);
      }
    }
    run();
    return () => { mounted = false; };
  }, [id, toast]);

  function setField(path, val) {
    setValues((prev) => {
      const next = structuredClone(prev);
      const keys = path.split('.');
      let cur = next;
      for (let i = 0; i < keys.length - 1; i++) cur = cur[keys[i]];
      cur[keys[keys.length - 1]] = val;
      return next;
    });
  }

  function touch(path) {
    setTouched((p) => ({ ...p, [path]: true }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    if (!values) return;

    setFormError('');
    setTouched({
      name: true, email: true, phone: true, company: true,
      'address.street': true, 'address.city': true, 'address.zipcode': true,
      'address.geo.lat': true, 'address.geo.lng': true
    });

    if (hasErrors) {
      setFormError('Please fix the errors below.');
      return;
    }

    setSaving(true);
    try {
      await updateUserPut(id, values);
      toast.success('User updated successfully');
      nav(`/users/${id}`);
    } catch (e2) {
      const apiErr = normalizeApiError(e2);
      setFormError(apiErr.message || 'Update failed');
      toast.error(apiErr.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <SkeletonRow />;
  if (notFound) {
    return (
      <div className="card" style={{ padding: 18 }}>
        <h3 style={{ margin: 0 }}>User not found</h3>
        <p style={{ color: 'var(--muted)' }}>The user you are trying to edit does not exist.</p>
        <Button onClick={() => nav('/users')}>Back to Users</Button>
      </div>
    );
  }
  if (!values) return null;

  return (
    <div className="grid" style={{ gap: 16 }}>
      <div>
        <h1 className="sectionTitle" style={{ marginBottom: 0 }}>Edit User</h1>
        <p className="sectionSub">Update and save changes</p>
      </div>

      <form className="card" onSubmit={onSubmit} style={{ padding: 18 }}>
        {formError ? (
          <div className="card" style={{ padding: 12, borderColor: 'rgba(239,68,68,0.35)', marginBottom: 14 }}>
            <div style={{ fontWeight: 800, color: 'var(--danger-600)' }}>Form error</div>
            <div style={{ color: 'var(--muted)', marginTop: 6 }}>{formError}</div>
          </div>
        ) : null}

        <div className="card" style={{ padding: 16, boxShadow: 'none' }}>
          <div style={{ fontWeight: 800, marginBottom: 12 }}>Basic Information</div>

          <div className="formGrid">
            <Field label="Name *" value={values.name} error={touched.name ? errors.name : ''} onBlur={() => touch('name')} onChange={(v) => setField('name', v)} />
            <Field label="Email *" value={values.email} error={touched.email ? errors.email : ''} onBlur={() => touch('email')} onChange={(v) => setField('email', v)} />
            <Field label="Phone *" value={values.phone} error={touched.phone ? errors.phone : ''} onBlur={() => touch('phone')} onChange={(v) => setField('phone', v)} />
            <Field label="Company *" value={values.company} error={touched.company ? errors.company : ''} onBlur={() => touch('company')} onChange={(v) => setField('company', v)} />
          </div>
        </div>

        <div style={{ height: 14 }} />

        <div className="card" style={{ padding: 16, boxShadow: 'none' }}>
          <div style={{ fontWeight: 800, marginBottom: 12 }}>Address</div>

          <div className="formGrid">
            <Field label="Street *" value={values.address.street} error={touched['address.street'] ? errors['address.street'] : ''} onBlur={() => touch('address.street')} onChange={(v) => setField('address.street', v)} />
            <div />
            <Field label="City *" value={values.address.city} error={touched['address.city'] ? errors['address.city'] : ''} onBlur={() => touch('address.city')} onChange={(v) => setField('address.city', v)} />
            <Field label="Zipcode *" value={values.address.zipcode} error={touched['address.zipcode'] ? errors['address.zipcode'] : ''} onBlur={() => touch('address.zipcode')} onChange={(v) => setField('address.zipcode', v)} />
          </div>

          <div style={{ height: 14 }} />

          <div style={{ fontWeight: 800, marginBottom: 12 }}>Geo</div>
          <div className="formGrid">
            <Field label="Latitude *" value={values.address.geo.lat} error={touched['address.geo.lat'] ? errors['address.geo.lat'] : ''} onBlur={() => touch('address.geo.lat')} onChange={(v) => setField('address.geo.lat', v)} />
            <Field label="Longitude *" value={values.address.geo.lng} error={touched['address.geo.lng'] ? errors['address.geo.lng'] : ''} onBlur={() => touch('address.geo.lng')} onChange={(v) => setField('address.geo.lng', v)} />
          </div>
        </div>

        <div className="row" style={{ justifyContent: 'flex-end', marginTop: 16 }}>
          <Button type="button" onClick={() => nav(`/users/${id}`)} disabled={saving}>Cancel</Button>
          <Button variant="primary" type="submit" disabled={saving || hasErrors}>
            {saving ? 'Saving...' : 'Save changes'}
          </Button>
        </div>
      </form>
    </div>
  );
}

function Field({ label, value, onChange, onBlur, error }) {
  return (
    <div>
      <div className="fieldLabel">{label}</div>
      <Input value={value} onChange={(e) => onChange(e.target.value)} onBlur={onBlur} error={Boolean(error)} />
      {error ? <div className="fieldErr">{error}</div> : null}
    </div>
  );
}
