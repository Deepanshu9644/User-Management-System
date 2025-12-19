import { http } from './http';

export async function listUsers(params) {
  const res = await http.get('/users', { params });
  return res.data;
}

export async function getUser(id) {
  const res = await http.get(`/users/${id}`);
  return res.data;
}

export async function createUser(payload) {
  const res = await http.post('/users', payload);
  return res.data;
}

export async function updateUserPut(id, payload) {
  const res = await http.put(`/users/${id}`, payload);
  return res.data;
}

export async function updateUserPatch(id, payload) {
  const res = await http.patch(`/users/${id}`, payload);
  return res.data;
}

export async function deleteUser(id) {
  const res = await http.delete(`/users/${id}`);
  return res.data;
}
