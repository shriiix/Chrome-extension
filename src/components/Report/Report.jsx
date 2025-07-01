import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import SearchBar from '../SearchBar';
import TaskCompact from './TaskCompact';
import TaskDetailed from './TaskDetailed';

const Report = ({ userName = "Gaurav Golecha", timeEntries = [], searchText = '',
  setSearchText = () => { } }) => {
  const [isCompact, setIsCompact] = useState(true);

  const filteredEntries = timeEntries.filter(entry =>
    entry.taskName.toLowerCase().includes(searchText.toLowerCase()) ||
    entry.projectName.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div className="bg-white min-h-screen p-6">

      {/* === Report Header Bar === */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <ChevronLeft className="cursor-pointer" />
          <span className="font-semibold top-10 text-gray-900">This week: Jun, 23 - Jun, 29</span>
          <ChevronRight className="cursor-pointer" />
        </div>
        <div className="text-gray-900 font-medium">{userName}</div>
      </div>
      {/* === Week Range Title and Time Reported === */}
      <div className="bg-gray-200 text-gray-800 p-4 rounded-lg shadow-lg max-w-4xl">


        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-lg font-bold">1:00</div>
            <div className="text-sm text-gray-900">Time reported</div>
          </div>

          <div className="flex space-x-2 text-black">
            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, index) => (
              <div
                key={index}
                className={`w-4 h-8 flex items-end justify-center rounded ${index === 2 ? 'bg-green-900' : 'bg-white'}`}
              >
                <span className="text-xs text-black">{day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* === Task List Toggle and View === */}
        <div>
          <div className="flex justify-between mb-2 overflow-auto">
            <span className="font-medium">Tasks</span>
            <div className="space-x-2">
              <button
                onClick={() => setIsCompact(false)}
                className={`px-3 py-1 rounded ${!isCompact ? 'bg-white text-black' : 'bg-green-600'}`}
              >
                Detailed
              </button>
              <button
                onClick={() => setIsCompact(true)}
                className={`px-3 py-1 rounded ${isCompact ? 'bg-white text-black' : 'bg-green-600'}`}
              >
                Compact
              </button>
            </div>
          </div>

          {/* Toggle View */}
          <div className="max-h-[300px] overflow-y-auto">
            {isCompact ? (
              <TaskCompact tasks={filteredEntries} />
            ) : (
              <TaskDetailed tasks={filteredEntries} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Report;
