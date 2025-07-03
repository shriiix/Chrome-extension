import React from 'react';
import { Play, Pause } from 'lucide-react';

const TimerButton = ({ isRunning, onToggle }) => {
  return (
    <div className="p-3 border-b border-gray-100">
      <button
        onClick={onToggle}
        className="w-full bg-purple-900 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-md flex 
                items-center justify-center space-x-2 transition-colors">
        {/* Dynamic Icon based on timer state */}
        {isRunning ? <Pause size={16} /> : <Play size={16} />}
        <span>{isRunning ? 'Stop Timer' : 'Start Timer'}</span>
      </button>
    </div>
  );
};

export default TimerButton;