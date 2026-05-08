import api from './applicationService';

const scholarshipService = {
  // Get all scholarships
  getAll: async (params) => {
    const response = await api.get('/scholarships', { params });
    return response.data;
  },

  // Search scholarships
  search: async (filters) => {
    const response = await api.get('/scholarships/search', { params: filters });
    return response.data;
  },

  // Get scholarship by ID
  getById: async (id) => {
    const response = await api.get(`/scholarships/${id}`);
    return response.data;
  },

  // Get filter options
  getFilterOptions: async () => {
    const response = await api.get('/scholarships/filter-options');
    return response.data;
  },

  // Get upcoming deadlines
  getUpcomingDeadlines: async () => {
    const response = await api.get('/scholarships/upcoming-deadlines');
    return response.data;
  },

  // Get recommended scholarships
  getRecommended: async () => {
    const response = await api.get('/scholarships/user/recommended');
    return response.data;
  },

  // Get saved scholarships
  getSaved: async () => {
    const response = await api.get('/scholarships/user/saved');
    return response.data;
  },

  // Save scholarship
  save: async (id) => {
    const response = await api.post(`/scholarships/${id}/save`);
    return response.data;
  },

  // Unsave scholarship
  unsave: async (id) => {
    const response = await api.delete(`/scholarships/${id}/save`);
    return response.data;
  },

  // Admin: Create scholarship
  create: async (data) => {
    const response = await api.post('/scholarships', data);
    return response.data;
  },

  // Admin: Update scholarship
  update: async (id, data) => {
    const response = await api.put(`/scholarships/${id}`, data);
    return response.data;
  },

  // Admin: Delete scholarship
  delete: async (id) => {
    const response = await api.delete(`/scholarships/${id}`);
    return response.data;
  },
};

export default scholarshipService;