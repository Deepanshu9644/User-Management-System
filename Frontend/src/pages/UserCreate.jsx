import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import Input from '../components/Input';
import { createUser } from '../api/users';
import { normalizeApiError } from '../api/http';
import { useToast } from '../components/ToastProvider';
import { validateUser } from '../utils/validators';

const emptyUser = {
  name: '',
  email: '',
  phone: '',
  company: '',
  address: {
    street: '',
    city: '',
    zipcode: '',
    geo: { lat: '', lng: '' }
  }
};

export default function UserCreate() {
  const nav = useNavigate();
  const toast = useToast();

  const [values, setValues] = useState(emptyUser);
  const [touched, setTouched] = useState({});
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');

  const errors = useMemo(() => validateUser(values), [values]);
  const hasErrors = Object.keys(errors).length > 0;

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
      // backend accepts lat/lng as string convertible to number
      const payload = {
        ...values,
        address: {
          ...values.address,
          geo: { lat: values.address.geo.lat, lng: values.address.geo.lng }
        }
      };
      await createUser(payload);
      toast.success('User created successfully');
      nav('/users');
    } catch (err) {
      const apiErr = normalizeApiError(err);
      setFormError(apiErr.message || 'Failed to create user');
      toast.error(apiErr.message || 'Failed to create user');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="grid" style={{ gap: 16 }}>
      <div>
        <h1 className="sectionTitle" style={{ marginBottom: 0 }}>Add New User</h1>
        <p className="sectionSub">Fill in the details to create a new user</p>
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
            <Field
              label="Name *"
              value={values.name}
              error={touched.name ? errors.name : ''}
              onBlur={() => touch('name')}
              onChange={(v) => setField('name', v)}
              placeholder="John Doe"
            />
            <Field
              label="Email *"
              value={values.email}
              error={touched.email ? errors.email : ''}
              onBlur={() => touch('email')}
              onChange={(v) => setField('email', v)}
              placeholder="john.doe@example.com"
            />
            <Field
              label="Phone *"
              value={values.phone}
              error={touched.phone ? errors.phone : ''}
              onBlur={() => touch('phone')}
              onChange={(v) => setField('phone', v)}
              placeholder="+1 (555) 123-4567"
            />
            <Field
              label="Company *"
              value={values.company}
              error={touched.company ? errors.company : ''}
              onBlur={() => touch('company')}
              onChange={(v) => setField('company', v)}
              placeholder="TechCorp Inc."
            />
          </div>
        </div>

        <div style={{ height: 14 }} />

        <div className="card" style={{ padding: 16, boxShadow: 'none' }}>
          <div style={{ fontWeight: 800, marginBottom: 12 }}>Address</div>

          <div className="formGrid">
            <Field
              label="Street *"
              value={values.address.street}
              error={touched['address.street'] ? errors['address.street'] : ''}
              onBlur={() => touch('address.street')}
              onChange={(v) => setField('address.street', v)}
              placeholder="123 Main Street"
            />
            <div />
            <Field
              label="City *"
              value={values.address.city}
              error={touched['address.city'] ? errors['address.city'] : ''}
              onBlur={() => touch('address.city')}
              onChange={(v) => setField('address.city', v)}
              placeholder="San Francisco"
            />
            <Field
              label="Zipcode *"
              value={values.address.zipcode}
              error={touched['address.zipcode'] ? errors['address.zipcode'] : ''}
              onBlur={() => touch('address.zipcode')}
              onChange={(v) => setField('address.zipcode', v)}
              placeholder="94102"
            />
          </div>

          <div style={{ height: 14 }} />

          <div style={{ fontWeight: 800, marginBottom: 12 }}>Geo</div>
          <div className="formGrid">
            <Field
              label="Latitude *"
              value={values.address.geo.lat}
              error={touched['address.geo.lat'] ? errors['address.geo.lat'] : ''}
              onBlur={() => touch('address.geo.lat')}
              onChange={(v) => setField('address.geo.lat', v)}
              placeholder="37.7749"
            />
            <Field
              label="Longitude *"
              value={values.address.geo.lng}
              error={touched['address.geo.lng'] ? errors['address.geo.lng'] : ''}
              onBlur={() => touch('address.geo.lng')}
              onChange={(v) => setField('address.geo.lng', v)}
              placeholder="-122.4194"
            />
          </div>
        </div>

        <div className="row" style={{ justifyContent: 'flex-end', marginTop: 16 }}>
          <Button type="button" onClick={() => nav('/users')} disabled={saving}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" disabled={saving || hasErrors}>
            {saving ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </form>
    </div>
  );
}

function Field({ label, value, onChange, onBlur, placeholder, error }) {
  return (
    <div>
      <div className="fieldLabel">{label}</div>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        placeholder={placeholder}
        error={Boolean(error)}
      />
      {error ? <div className="fieldErr">{error}</div> : null}
    </div>
  );
}
