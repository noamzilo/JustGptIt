import React, { useState, useEffect } from 'react';

const formatArgentinaTime = (date) => {
  return date.toLocaleString('en-US', {
    timeZone: 'America/Argentina/Buenos_Aires',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });
};

const ErrorPage = () => {
  const [currentTime, setCurrentTime] = useState('');
//   const buildTime = formatArgentinaTime(new Date(__BUILD_TIME__));
  const refreshTime = formatArgentinaTime(new Date());

  useEffect(() => {
    const updateTime = () => {
      setCurrentTime(formatArgentinaTime(new Date()));
    };

    updateTime();
    const intervalId = setInterval(updateTime, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-3xl font-bold mb-4">Error</h1>
      <p className="mb-6">API URL is not defined. Please contact support.</p>
      <div className="space-y-2 text-left">
        {/* <p>Build time (Argentina): <span className="font-semibold">{buildTime}</span></p> */}
        <p>Refresh time (Argentina): <span className="font-semibold">{refreshTime}</span></p>
        <p>Current time (Argentina): <span className="font-semibold">{currentTime}</span></p>
      </div>
    </div>
  );
};

export default ErrorPage;