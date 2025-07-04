// ✅ src/components/timer/WorkTimer.jsx
import React from 'react';

const formatTime = (totalSeconds) => {
  const hrs = Math.floor(totalSeconds / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;

  return [hrs, mins, secs]
    .map((val) => String(val).padStart(2, '0'))
    .join(':');
};

const WorkTimer = ({ seconds }) => {
  return (
    <div className="text-sm text-green-600 font-medium">
      Work: {formatTime(seconds)}
    </div>
  );
};

export default WorkTimer;
