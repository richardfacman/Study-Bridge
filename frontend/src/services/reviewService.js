import api from './applicationService';

const reviewService = {
  // Get reviews by university
  getByUniversity: async (universityId, params) => {
    const response = await api.get(`/reviews/university/${universityId}`, { params });
    return response.data;
  },

  // Get review by ID
  getById: async (id) => {
    const response = await api.get(`/reviews/${id}`);
    return response.data;
  },

  // Create review
  create: async (data) => {
    const response = await api.post('/reviews', data);
    return response.data;
  },

  // Update review
  update: async (id, data) => {
    const response = await api.put(`/reviews/${id}`, data);
    return response.data;
  },

  // Delete review
  delete: async (id) => {
    const response = await api.delete(`/reviews/${id}`);
    return response.data;
  },

  // Mark review as helpful
  markHelpful: async (id) => {
    const response = await api.post(`/reviews/${id}/helpful`);
    return response.data;
  },

  // Report review
  report: async (id, reason) => {
    const response = await api.post(`/reviews/${id}/report`, { reason });
    return response.data;
  },

  // Upload review photos
  uploadPhotos: async (id, files) => {
    const formData = new FormData();
    files.forEach((file) => formData.append('photos', file));
    const response = await api.post(`/reviews/${id}/photos`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  // Get my reviews
  getMyReviews: async () => {
    const response = await api.get('/reviews/user/my-reviews');
    return response.data;
  },

  // Admin: Get pending reviews
  getPending: async () => {
    const response = await api.get('/reviews/admin/pending');
    return response.data;
  },

  // Admin: Approve review
  approve: async (id) => {
    const response = await api.patch(`/reviews/${id}/approve`);
    return response.data;
  },

  // Admin: Reject review
  reject: async (id, reason) => {
    const response = await api.patch(`/reviews/${id}/reject`, { reason });
    return response.data;
  },
};

export default reviewService;