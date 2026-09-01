import api from './api';

export const login = (email, password) =>
  api.post('/auth/login', { email, password }).then((res) => res.data);

export const register = (payload) =>
  api.post('/auth/register', payload).then((res) => res.data);

export const changePassword = (payload) =>
  api.put('/auth/change-password', payload).then((res) => res.data);

export const fetchMe = () => api.get('/auth/me').then((res) => res.data);
