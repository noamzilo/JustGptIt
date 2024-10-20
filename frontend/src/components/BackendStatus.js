import React, { useState, useEffect } from 'react';
import apiService from '../services/apiService';

function BackendStatus() {
  const [status, setStatus] = useState('Checking...');
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkBackend = async () => {
      try {
        const response = await apiService.get('/health/');
        setStatus(response.data.status);
        setError(null);
      } catch (error) {
        console.error('Error checking backend status:', error);
        setStatus('Error connecting to backend');
        setError(error.message);
      }
    };

    checkBackend();
    const interval = setInterval(checkBackend, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <h3>Backend Status: {status}</h3>
      {error && <p>Error details: {error}</p>}
    </div>
  );
}

export default BackendStatus;