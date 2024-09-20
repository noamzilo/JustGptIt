import React, { useState, useEffect } from 'react';
import BackendLivenessService from '../services/backendLivenessService.js';

const BackendHealthIndicator = () => {
  const [isHealthy, setIsHealthy] = useState(true);

  useEffect(() => {
    const checkHealth = async () => {
      const healthy = await BackendLivenessService.isBackendHealthy();
      setIsHealthy(healthy);
    };

    checkHealth();
    const interval = setInterval(checkHealth, 1000); // Check every 1 second

    return () => clearInterval(interval);
  }, []);

  const indicatorStyle = {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    backgroundColor: isHealthy ? 'green' : 'red',
    display: 'inline-block',
    marginLeft: '10px'
  };

  return <div style={indicatorStyle} title={isHealthy ? 'Backend is healthy' : 'Backend is unavailable'} />;
};

export default BackendHealthIndicator;