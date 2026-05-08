import api from './applicationService';

const universityService = {
  // Get all universities
  getAll: async (params) => {
    const response = await api.get('/universities', { params });
    return response.data;
  },

  // Search universities
  search: async (filters) => {
    const response = await api.get('/universities/search', { params: filters });
    return response.data;
  },

  // Get university by ID
  getById: async (id) => {
    const response = await api.get(`/universities/${id}`);
    return response.data;
  },

  // Get university by slug
  getBySlug: async (slug) => {
    const response = await api.get(`/universities/slug/${slug}`);
    return response.data;
  },

  // Get filter options
  getFilterOptions: async () => {
    const response = await api.get('/universities/filter-options');
    return response.data;
  },

  // Compare universities
  compare: async (universityIds) => {
    const response = await api.post('/universities/compare', { universityIds });
    return response.data;
  },

  // Get similar universities
  getSimilar: async (id) => {
    const response = await api.get(`/universities/${id}/similar`);
    return response.data;
  },

  // Get popular universities
  getPopular: async () => {
    const response = await api.get('/universities/popular');
    return response.data;
  },

  // Get featured universities
  getFeatured: async () => {
    const response = await api.get('/universities/featured');
    return response.data;
  },

  // Increment view count
  incrementView: async (id) => {
    const response = await api.post(`/universities/${id}/view`);
    return response.data;
  },

  // Admin: Create university
  create: async (data) => {
    const response = await api.post('/universities', data);
    return response.data;
  },

  // Admin: Update university
  update: async (id, data) => {
    const response = await api.put(`/universities/${id}`, data);
    return response.data;
  },

  // Admin: Delete university
  delete: async (id) => {
    const response = await api.delete(`/universities/${id}`);
    return response.data;
  },

  // Admin: Import from CSV
  importCSV: async (file) => {
    const formData = new FormData();
    formData.append('csv', file);
    const response = await api.post('/universities/import/csv', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
};

export default universityService;