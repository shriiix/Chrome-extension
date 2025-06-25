import React from 'react';

const TimerDisplay = ({ timerSeconds, formatTime }) => {
  return (
    <div className="px-4 py-2 bg-green-50 border-b border-green-100">
      <div className="text-sm text-green-700">
        Running: {formatTime(timerSeconds)}
      </div>
    </div>
  );
};

export default TimerDisplay;