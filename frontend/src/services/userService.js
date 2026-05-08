import api from './applicationService';

const userService = {
  // Get profile
  getProfile: async () => {
    const response = await api.get('/users/profile');
    return response.data;
  },

  // Update profile
  updateProfile: async (data) => {
    const response = await api.put('/users/profile', data);
    return response.data;
  },

  // Upload profile picture
  uploadProfilePicture: async (file) => {
    const formData = new FormData();
    formData.append('profilePicture', file);
    const response = await api.post('/users/profile/picture', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  // Delete profile picture
  deleteProfilePicture: async () => {
    const response = await api.delete('/users/profile/picture');
    return response.data;
  },

  // Get saved universities
  getSavedUniversities: async () => {
    const response = await api.get('/users/saved-universities');
    return response.data;
  },

  // Save university
  saveUniversity: async (universityId) => {
    const response = await api.post(`/users/saved-universities/${universityId}`);
    return response.data;
  },

  // Unsave university
  unsaveUniversity: async (universityId) => {
    const response = await api.delete(`/users/saved-universities/${universityId}`);
    return response.data;
  },

  // Get saved searches
  getSavedSearches: async () => {
    const response = await api.get('/users/saved-searches');
    return response.data;
  },

  // Save search
  saveSearch: async (data) => {
    const response = await api.post('/users/saved-searches', data);
    return response.data;
  },

  // Delete search
  deleteSearch: async (searchId) => {
    const response = await api.delete(`/users/saved-searches/${searchId}`);
    return response.data;
  },

  // Update preferences
  updatePreferences: async (preferences) => {
    const response = await api.put('/users/preferences', preferences);
    return response.data;
  },

  // Get recommendations
  getRecommendations: async () => {
    const response = await api.get('/users/recommendations');
    return response.data;
  },

  // Delete account
  deleteAccount: async (password) => {
    const response = await api.delete('/users/account', { data: { password } });
    return response.data;
  },
};

export default userService;