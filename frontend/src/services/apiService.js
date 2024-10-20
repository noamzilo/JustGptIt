import axios from 'axios';
import ErrorPage from '../components/ErrorPage';
import React from 'react';
import ReactDOM from 'react-dom';

const REACT_APP_API_URL = process.env.REACT_APP_API_URL;
if (!REACT_APP_API_URL) {
  ReactDOM.render(<ErrorPage />, document.getElementById('root'));
  throw new Error('REACT_APP_API_URL is not defined');
}

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