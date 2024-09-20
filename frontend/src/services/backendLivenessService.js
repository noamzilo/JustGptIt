import apiService from './apiService';

const BackendLivenessService = {
  isBackendHealthy: async () => {
    try {
      const response = await apiService.get('/health/');
      return response.status === 'healthy';
    } catch (error) {
      console.error('Backend health check failed:', error);
      return false;
    }
  }
};

export default BackendLivenessService;