import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';
const isStaging = process.env.REACT_APP_ENVIRONMENT === 'staging';

const apiService = {
  get: async (endpoint) => {
    try {
      if (isStaging) {
        // In staging, fetch the static JSON file
        const response = await axios.get(`${process.env.PUBLIC_URL}/mock-data.json`);
        // Simulate API behavior by returning only the relevant part of the data
        const mockData = response.data;
        return mockData[endpoint.replace('/', '')] || mockData;
      } else {
        // In development or production, use the actual API
        const response = await axios.get(`${API_URL}${endpoint}`);
        return response.data;
      }
    } catch (error) {
      console.error(`Error fetching data from ${endpoint}:`, error);
      throw error;
    }
  },

  post: async (endpoint, data) => {
    if (isStaging) {
      console.log('POST request simulated in staging:', endpoint, data);
      return { success: true, message: 'Data received (simulated)' };
    }
    try {
      const response = await axios.post(`${API_URL}${endpoint}`, data);
      return response.data;
    } catch (error) {
      console.error(`Error posting data to ${endpoint}:`, error);
      throw error;
    }
  }

  // You can add more methods here for other HTTP methods as needed
};

export default apiService;