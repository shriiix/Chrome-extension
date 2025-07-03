import React, { useEffect, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import TimeEntry from './TimeEntry';
import { fetchTasks } from '../services/auth'; // Make sure path is correct

const DateSection = ({ 
  dateLabel, // renamed from DateSection (conflicting name)
  totalTime, 
  isExpanded, 
  onToggle, 
  onEditEntry, 
  onDeleteEntry,
  onEditTaskName,
  editingTaskId,
  setEditingTaskId
}) => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getUserTasks = async () => {
      if (isExpanded) {
        setLoading(true);
        const tasks = await fetchTasks();
        setEntries(tasks || []);
        setLoading(false);
      }
    };
    getUserTasks();
  }, [isExpanded]); // Fetch only when expanded

  return (
    <div className="border-b border-gray-100 overflow-y-auto">
      {/* Header */}
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-3 text-left hover:bg-gray-50 overflow-auto"
      >
        <div className="flex items-center space-x-2">
          <ChevronDown 
            className={`transform transition-transform ${isExpanded ? 'rotate-0' : '-rotate-90'}`} 
            size={16} 
          />
          <span className="text-sm font-medium text-gray-700">{dateLabel}</span>
          <span className="text-sm font-medium text-gray-900">Task-List</span>
        </div>
      </button>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="bg-gray-50 max-h-full overflow-y-auto">
          <div className="px-6 py-2">
            <div className="text-xs font-medium text-gray-500 mb-2 overflow-auto">
              {dateLabel}
            </div>
          </div>

          {loading ? (
            <p className="text-center text-sm text-gray-500 py-2">Loading tasks...</p>
          ) : (
            entries.map(entry => (
              <TimeEntry 
                key={entry.id} 
                entry={entry} 
                onEdit={onEditEntry}
                onDelete={onDeleteEntry}
                onEditTaskName={onEditTaskName}
                editingTaskId={editingTaskId}
                setEditingTaskId={setEditingTaskId}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default DateSection;
