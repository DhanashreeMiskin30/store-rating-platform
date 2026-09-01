import api from './api';

export const submitRating = (storeId, rating) =>
  api.post('/ratings', { storeId, rating }).then((res) => res.data);

export const updateRating = (storeId, rating) =>
  api.put(`/ratings/${storeId}`, { rating }).then((res) => res.data);
