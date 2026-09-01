import api from './api';

export const listStores = (params) => api.get('/stores', { params }).then((res) => res.data);

export const getStoreById = (id) => api.get(`/stores/${id}`).then((res) => res.data);
