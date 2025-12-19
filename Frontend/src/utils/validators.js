const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateUser(values) {
  const errors = {};

  const req = (path, msg) => {
    const v = path.split('.').reduce((acc, k) => acc?.[k], values);
    if (v === undefined || v === null || String(v).trim() === '') errors[path] = msg;
  };

  req('name', 'Name is required');
  req('email', 'Email is required');
  req('phone', 'Phone is required');
  req('company', 'Company is required');
  req('address.street', 'Street is required');
  req('address.city', 'City is required');
  req('address.zipcode', 'Zipcode is required');
  req('address.geo.lat', 'Latitude is required');
  req('address.geo.lng', 'Longitude is required');

  if (values.email && !emailRe.test(String(values.email).trim())) {
    errors.email = 'Email must be valid';
  }

  const phoneDigits = String(values.phone || '').replace(/\D/g, '');
  if (values.phone && phoneDigits.length < 8) {
    errors.phone = 'Phone must have at least 8 digits';
  }

  const lat = Number(values?.address?.geo?.lat);
  const lng = Number(values?.address?.geo?.lng);

  if (values?.address?.geo?.lat !== '' && !Number.isFinite(lat)) errors['address.geo.lat'] = 'Latitude must be a number';
  if (values?.address?.geo?.lng !== '' && !Number.isFinite(lng)) errors['address.geo.lng'] = 'Longitude must be a number';

  return errors;
}
