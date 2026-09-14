import api from './api';

export const sendConnectionRequest = (payload) => api.post('/connections', payload);
export const getSentConnections = () => api.get('/connections/sent');
export const getReceivedConnections = () => api.get('/connections/received');
export const updateConnectionStatus = (id, status) => api.patch(`/connections/${id}/status`, { status });
