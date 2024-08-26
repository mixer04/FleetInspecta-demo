import React, { useEffect, useState } from 'react';
import './DateWidget.css';

export default function DateWidget() {
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentDate(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDate = (date) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString(undefined, options);
  };

  return (
    <div className="date-widget">
      <span>{formatDate(currentDate)}</span>
    </div>
  );
}