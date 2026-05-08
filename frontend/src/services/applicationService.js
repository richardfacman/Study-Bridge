import api, { get, post, put, patch, del } from '../utils/apiClient';

export { get, post, put, patch, del };

export const applicationService = {
  // Create application
  create: async (data) => {
    const response = await api.post('/applications', data);
    return response.data;
  },

  // Get all applications
  getAll: async (params) => {
    const response = await api.get('/applications', { params });
    return response.data;
  },

  // Get application by ID
  getById: async (id) => {
    const response = await api.get(`/applications/${id}`);
    return response.data;
  },

  // Update application
  update: async (id, data) => {
    const response = await api.put(`/applications/${id}`, data);
    return response.data;
  },

  // Delete application
  delete: async (id) => {
    const response = await api.delete(`/applications/${id}`);
    return response.data;
  },

  // Update status
  updateStatus: async (id, status) => {
    const response = await api.patch(`/applications/${id}/status`, { status });
    return response.data;
  },

  // Upload document
  uploadDocument: async (id, file, type) => {
    const formData = new FormData();
    formData.append('document', file);
    formData.append('type', type);
    const response = await api.post(`/applications/${id}/documents`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  // Delete document
  deleteDocument: async (id, documentId) => {
    const response = await api.delete(`/applications/${id}/documents/${documentId}`);
    return response.data;
  },

  // Add note
  addNote: async (id, content) => {
    const response = await api.post(`/applications/${id}/notes`, { content });
    return response.data;
  },

  // Get timeline
  getTimeline: async (id) => {
    const response = await api.get(`/applications/${id}/timeline`);
    return response.data;
  },

  // Check eligibility
  checkEligibility: async (data) => {
    const response = await api.post('/applications/check-eligibility', data);
    return response.data;
  },

  // Generate document checklist
  generateChecklist: async (data) => {
    const response = await api.post('/applications/document-checklist', data);
    return response.data;
  },

  // Get stats
  getStats: async () => {
    const response = await api.get('/applications/stats');
    return response.data;
  },

  // Get upcoming deadlines
  getUpcomingDeadlines: async () => {
    const response = await api.get('/applications/upcoming-deadlines');
    return response.data;
  },
};

// Default export is the axios client for backward compatibility with services that use api.get/post/etc
export default api;