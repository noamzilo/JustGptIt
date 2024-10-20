import React, { useState, useEffect } from 'react';
import BackendLivenessService from '../services/backendLivenessService.js';

import ErrorPage from '../components/ErrorPage';
import React from 'react';
import ReactDOM from 'react-dom';

const BackendHealthIndicator = () => {
  const [isHealthy, setIsHealthy] = useState(true);

  const REACT_APP_API_URL = process.env.REACT_APP_API_URL;
  if (!REACT_APP_API_URL) {
    ReactDOM.render(<ErrorPage />, document.getElementById('root'));
    throw new Error('REACT_APP_API_URL is not defined');
  }
  
  useEffect(() => {
    const checkHealth = async () => {
      const healthy = await BackendLivenessService.isBackendHealthy();
      setIsHealthy(healthy);
    };

    checkHealth();
    const interval = setInterval(checkHealth, 300000); // Check every 300 seconds

    return () => clearInterval(interval);
  }, []);

  const indicatorStyle = {
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    backgroundColor: isHealthy ? 'green' : 'red',
    display: 'inline-block',
    marginLeft: '10px'
  };

  return <div style={indicatorStyle} title={isHealthy ? 'Backend is healthy' : 'Backend is unavailable'} />;
};

export default BackendHealthIndicator;