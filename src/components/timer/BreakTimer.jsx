// ✅ src/components/timer/BreakTimer.jsx
import React from 'react';

const formatTime = (totalSeconds) => {
  const hrs = Math.floor(totalSeconds / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;

  return [hrs, mins, secs]
    .map((val) => String(val).padStart(2, '0'))
    .join(':');
};

const BreakTimer = ({ seconds }) => {
  if (seconds <= 0) return null;

  return (
    <div className="text-sm text-orange-600 font-medium">
      Break: {formatTime(seconds)}
    </div>
  );
};

export default BreakTimer;
