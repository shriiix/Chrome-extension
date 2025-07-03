import React, { useState } from 'react';
import { MoreHorizontal } from 'lucide-react';

const TimeEntry = ({ entry, onDelete }) => {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="flex items-center justify-between py-3 px-4 hover:bg-gray-50 group">
      <div className="flex items-center space-x-3">
        <div className="text-sm font-medium text-gray-600 w-8">{entry.duration || '--'}</div>
        <div className={`w-2 h-2 rounded-full ${entry.projectColor}`}></div>
        <div className="flex-1">
          <div className="text-sm font-medium text-gray-900">
            {entry.taskName || entry.title || 'Untitled Task'}
          </div>
          <div className="text-xs text-gray-500">
            {entry.projectCode} • {entry.projectName}
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        {entry.taskFields?.dueDate && (
          <div className="text-xs text-gray-500 whitespace-nowrap">
            Due: {new Date(entry.taskFields.dueDate).toLocaleDateString()}
          </div>
        )}

        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-1 text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <MoreHorizontal size={16} />
          </button>

          {showMenu && (
            <div className="absolute right-5 mt-1 w-32 bg-white border border-gray-200 rounded-md shadow-lg z-10">
              <button
                onClick={() => {
                  onDelete(entry.id);
                  setShowMenu(false);
                }}
                className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-gray-100"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TimeEntry;
