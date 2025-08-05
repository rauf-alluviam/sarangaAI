import React, { useState, useEffect } from 'react';
import './DojoL1.css';

const DojoL2 = () => {
  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const targetDate = new Date('August 8, 2025 00:00:00').getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const timeRemaining = targetDate - now;

      const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
      const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

      setDays(days);
      setHours(hours);
      setMinutes(minutes);
      setSeconds(seconds);
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="coming-soon-container">
      {/* Background Elements */}
      <div className="background-elements">
        <div className="circle circle-1"></div>
        <div className="circle circle-2"></div>
        <div className="circle circle-3"></div>
        <div className="circle circle-4"></div>
      </div>

      {/* Content */}
      <div className="content-wrapper">
        <div className="logo">
          <span className="logo-part-1">DOJO</span>
          <span className="logo-part-2">L2</span>
        </div>

        <h1 className="title">
          Something <span>Amazing</span> is Coming
        </h1>
        <p className="subtitle">We're preparing something special for you. Stay tuned!</p>

        {/* Countdown Timer */}
        <div className="countdown-timer">
          <div className="timer-box">
            <div className="timer-value">{days}</div>
            <div className="timer-label">Days</div>
          </div>
          <div className="timer-box">
            <div className="timer-value">{hours}</div>
            <div className="timer-label">Hours</div>
          </div>
          <div className="timer-box">
            <div className="timer-value">{minutes}</div>
            <div className="timer-label">Minutes</div>
          </div>
          <div className="timer-box">
            <div className="timer-value">{seconds}</div>
            <div className="timer-label">Seconds</div>
          </div>
        </div>

        <div className="target-date">
          <i className="fas fa-calendar-alt"></i> August 8, 2025
        </div>
      </div>

      {/* Footer */}
      <div className="footer">
        <p>© 2025 Dojo Level 1. All rights reserved.</p>
      </div>
    </div>
  );
};

export default DojoL2;
