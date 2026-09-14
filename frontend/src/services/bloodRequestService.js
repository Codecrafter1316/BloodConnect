import api from './api';

export const getOpenBloodRequests = () => api.get('/blood-requests/open');
export const getMyBloodRequests = () => api.get('/blood-requests/my');
export const getBloodRequest = (id) => api.get(`/blood-requests/${id}`);
export const createBloodRequest = (payload) => api.post('/blood-requests', payload);
export const updateBloodRequest = (id, payload) => api.put(`/blood-requests/${id}`, payload);
export const cancelBloodRequest = (id) => api.patch(`/blood-requests/${id}/cancel`);
