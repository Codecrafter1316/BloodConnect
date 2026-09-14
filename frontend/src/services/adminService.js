import api from './api';

export const getAdminDashboard = () => api.get('/admin/dashboard');
export const getAdminUsers = (params) => api.get('/admin/users', { params });
export const getAdminUser = (id) => api.get(`/admin/users/${id}`);
export const updateUserStatus = (id, is_active) => api.patch(`/admin/users/${id}/status`, { is_active });
export const getAdminBloodRequests = (params) => api.get('/admin/blood-requests', { params });
export const getAdminConnections = (params) => api.get('/admin/connections', { params });
