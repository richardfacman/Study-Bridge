import api from './applicationService';

const adminService = {
  // Dashboard
  getDashboardStats: async () => {
    const response = await api.get('/admin/dashboard/stats');
    return response.data;
  },

  getUniversityStats: async () => {
    const response = await api.get('/admin/dashboard/university-stats');
    return response.data;
  },

  getApplicationStats: async () => {
    const response = await api.get('/admin/dashboard/application-stats');
    return response.data;
  },

  // User Management
  getAllUsers: async (params) => {
    const response = await api.get('/admin/users', { params });
    return response.data;
  },

  getUserById: async (id) => {
    const response = await api.get(`/admin/users/${id}`);
    return response.data;
  },

  updateUserRole: async (id, role) => {
    const response = await api.patch(`/admin/users/${id}/role`, { role });
    return response.data;
  },

  suspendUser: async (id, reason) => {
    const response = await api.patch(`/admin/users/${id}/suspend`, { reason });
    return response.data;
  },

  unsuspendUser: async (id) => {
    const response = await api.patch(`/admin/users/${id}/unsuspend`);
    return response.data;
  },

  deleteUser: async (id) => {
    const response = await api.delete(`/admin/users/${id}`);
    return response.data;
  },

  verifyUser: async (id) => {
    const response = await api.patch(`/admin/users/${id}/verify`);
    return response.data;
  },

  // System
  getSystemHealth: async () => {
    const response = await api.get('/admin/system/health');
    return response.data;
  },

  sendBulkEmail: async (data) => {
    const response = await api.post('/admin/bulk-email', data);
    return response.data;
  },

  exportData: async (type) => {
    const response = await api.post('/admin/export-data', { type });
    return response.data;
  },
};

export default adminService;