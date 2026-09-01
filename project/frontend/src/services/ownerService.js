import api from './api';

export const getDashboard = () => api.get('/owner/dashboard').then((res) => res.data);

export const getRatings = () => api.get('/owner/ratings').then((res) => res.data);
