import api from './api';

export const getDonorProfile = () => api.get('/donors/profile');
export const createDonorProfile = (payload) => api.post('/donors/profile', payload);
export const updateDonorProfile = (payload) => api.put('/donors/profile', payload);
export const updateAvailability = (is_available) => api.patch('/donors/availability', { is_available });
export const searchDonors = (params) => api.get('/donors/search', { params });
