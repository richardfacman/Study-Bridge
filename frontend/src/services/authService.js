import api from './applicationService';

const authService = {
  // Register
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  // Login
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  // Logout
  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  },

  // Verify email
  verifyEmail: async (token) => {
    const response = await api.get(`/auth/verify-email/${token}`);
    return response.data;
  },

  // Resend verification
  resendVerification: async (email) => {
    const response = await api.post('/auth/resend-verification', { email });
    return response.data;
  },

  // Forgot password
  forgotPassword: async (email) => {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  },

  // Reset password
  resetPassword: async (token, password) => {
    const response = await api.put(`/auth/reset-password/${token}`, { password });
    return response.data;
  },

  // Get current user
  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  // Update password
  updatePassword: async (currentPassword, newPassword) => {
    const response = await api.put('/auth/update-password', {
      currentPassword,
      newPassword,
    });
    return response.data;
  },

  // Enable 2FA
  enable2FA: async () => {
    const response = await api.post('/auth/2fa/enable');
    return response.data;
  },

  // Verify 2FA
  verify2FA: async (token) => {
    const response = await api.post('/auth/2fa/verify', { token });
    return response.data;
  },

  // Disable 2FA
  disable2FA: async (token) => {
    const response = await api.post('/auth/2fa/disable', { token });
    return response.data;
  },

  // Google OAuth
  googleAuth: () => {
    window.location.href = `${api.defaults.baseURL}/auth/google`;
  },

  // Facebook OAuth
  facebookAuth: () => {
    window.location.href = `${api.defaults.baseURL}/auth/facebook`;
  },

  // LinkedIn OAuth
  linkedinAuth: () => {
    window.location.href = `${api.defaults.baseURL}/auth/linkedin`;
  },
};

export default authService;