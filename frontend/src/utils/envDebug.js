// frontend/src/utils/envDebug.js

const debugEnvironment = () => {
    const envVars = {
      NODE_ENV: process.env.NODE_ENV,
      REACT_APP_API_URL: process.env.REACT_APP_API_URL,
      REACT_APP_ENVIRONMENT: process.env.REACT_APP_ENVIRONMENT,
      ENVIRONMENT: process.env.ENVIRONMENT,
    };
  
    console.log('Environment Variables Debug:');
    console.table(envVars);
  
    if (!process.env.REACT_APP_API_URL) {
      console.error('REACT_APP_API_URL is not defined! This will cause the error page to show.');
      console.log('Please ensure:');
      console.log('1. .env file exists in frontend directory');
      console.log('2. .env file contains REACT_APP_API_URL=http://localhost:8080/api');
      console.log('3. React app was restarted after creating/modifying .env');
    }
  
    return envVars;
  };
  
  export default debugEnvironment;