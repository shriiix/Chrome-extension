import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import TaskCompact from './TaskCompact';
import TaskDetailed from './TaskDetailed';

const Report = ({ userName = "Gaurav Golecha" }) => {
  const [isCompact, setIsCompact] = useState(true);

  const tasks = [
    { id: 'AD-805', title: 'PM Daily Operations – Project Amdital', time: '1:00' },];

  return (
    <div className="bg-white min-h-screen p-6 overflow-auto">
      {/* === Report Header Bar === */}
      <div className="flex items-center justify-between mb-6 border-b pb-3 overflow-auto">
        <div className="flex items-center space-x-6">
          <img
            src="https://ui-avatars.com/api/?name=Gaurav+Golecha"
            alt="Profile"
            className="w-8 h-8 rounded-full"
          />
          <span className="font-semibold text-gray-800">{userName}</span>
        </div>
      </div>

      {/* === Search & Timer Section === */}
      <div className="flex items-center justify-between mb-4">
        <input
          type="text"
          placeholder="Type to find tasks or enter free text"
          className="w-1/2 px-4 py-2 border border-gray-300 rounded-md shadow-sm"
        />
        <button className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600">
          ▶ Start Timer
        </button>
      </div>

      {/* === Week Range Title and Time Reported === */}
      <div className="bg-gray-200 text-gray-800  p-4 rounded-lg shadow-lg max-w-4xl overflow-auto">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <ChevronLeft className="cursor-pointer" />
            <span className="font-semibold text-gray-900">This week: Jun, 23 - Jun, 29</span>
            <ChevronRight className="cursor-pointer" />
          </div>
          <div className="text-gray-900 font-medium">{userName}</div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-lg font-bold">1:00</div>
            <div className="text-sm text-gray-900">Time reported</div>
          </div>

          <div className="flex space-x-2 text-black">
            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, index) => (
              <div
                key={index}
                className={`w-4 h-8 flex items-end justify-center rounded ${
                  index === 2 ? 'bg-green-900' : 'bg-white'
                }`}
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
              >Detailed
              </button>
              <button
                onClick={() => setIsCompact(true)}
                className={`px-3 py-1 rounded ${isCompact ? 'bg-white text-black' : 'bg-green-600'}`}
              >Compact
              </button>
            </div>
          </div>

          {/* Toggle View */}
                  <div className="max-h-[300px] overflow-y-auto">
                      {isCompact ? (
                          <TaskCompact tasks={tasks} />
                      ) : (
                          <TaskDetailed tasks={tasks} />
                      )}
                  </div>
        </div>
      </div>
    </div>
  );
};

export default Report;
