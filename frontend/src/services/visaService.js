import api from './applicationService';

const visaService = {
  // Get all visa guides
  getAll: async () => {
    const response = await api.get('/visa');
    return response.data;
  },

  // Get visa guide by country
  getByCountry: async (country) => {
    const response = await api.get(`/visa/${country}`);
    return response.data;
  },

  // Calculate financial requirements
  calculateFinancial: async (data) => {
    const response = await api.post('/visa/calculate-financial', data);
    return response.data;
  },

  // Get visa checklist
  getChecklist: async (data) => {
    const response = await api.post('/visa/checklist', data);
    return response.data;
  },

  // Admin: Create visa guide
  create: async (data) => {
    const response = await api.post('/visa', data);
    return response.data;
  },

  // Admin: Update visa guide
  update: async (id, data) => {
    const response = await api.put(`/visa/${id}`, data);
    return response.data;
  },

  // Admin: Delete visa guide
  delete: async (id) => {
    const response = await api.delete(`/visa/${id}`);
    return response.data;
  },
};

export default visaService;