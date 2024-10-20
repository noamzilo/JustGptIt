import axios from 'axios';

const REACT_APP_API_URL = process.env.REACT_APP_API_URL || 'FAILED_REACT_APP_API_URL';

const apiService = {
  get: async (endpoint) => {
    try {
      const response = await axios.get(`${REACT_APP_API_URL}${endpoint}`, { withCredentials: true });
      return response.data;
    } catch (error) {
      console.error(`Error fetching data from ${endpoint}:`, error);
      throw error;
    }
  },

  post: async (endpoint, data) => {
    try {
      const response = await axios.post(`${REACT_APP_API_URL}${endpoint}`, data);
      return response.data;
    } catch (error) {
      console.error(`Error posting data to ${endpoint}:`, error);
      throw error;
    }
  }

  // You can add more methods here for other HTTP methods as needed
};

export default apiService;