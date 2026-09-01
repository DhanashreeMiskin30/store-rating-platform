import api from './api';

export const getDashboard = () => api.get('/admin/dashboard').then((res) => res.data);

export const createUser = (payload) => api.post('/admin/users', payload).then((res) => res.data);

export const createStore = (payload) => api.post('/admin/stores', payload).then((res) => res.data);

export const listUsers = (params) => api.get('/admin/users', { params }).then((res) => res.data);

export const getUserDetails = (id) => api.get(`/admin/users/${id}`).then((res) => res.data);

export const listStores = (params) => api.get('/admin/stores', { params }).then((res) => res.data);
