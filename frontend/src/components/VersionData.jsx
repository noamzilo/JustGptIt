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

const VersionData = () => {
    const [currentTime, setCurrentTime] = useState('');
    const buildTime = formatArgentinaTime(new Date(process.env.REACT_APP_BUILD_TIME));

    useEffect(() => {
        const updateTime = () => {
        setCurrentTime(formatArgentinaTime(new Date()));
        };

        updateTime();
        const intervalId = setInterval(updateTime, 1000);

        return () => clearInterval(intervalId);
    }, []);

    return (
        <div className="space-y-2 text-left">
        <p>Build time (Argentina): <span className="font-semibold">{buildTime}</span></p>
        <p>Current time (Argentina): <span className="font-semibold">{currentTime}</span></p>
      </div>
    );
};

export default VersionData;