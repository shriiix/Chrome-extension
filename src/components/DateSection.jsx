import React from 'react';
import { ChevronDown } from 'lucide-react';
import TimeEntry from './TimeEntry';

const DateSection = ({ 
  dateRange, 
  totalTime, 
  isExpanded, 
  onToggle, 
  entries, 
  onEditEntry, 
  onDeleteEntry,
  onEditTaskName,
  editingTaskId,
  setEditingTaskId

}) => {
  return (
    <div className="border-b border-gray-100">
      {/* Date Section Header */}
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-3 text-left hover:bg-gray-50"
      >
        <div className="flex items-center space-x-2">
          {/* Expand/Collapse Icon */}
          <ChevronDown 
            className={`transform transition-transform ${isExpanded ? 'rotate-0' : '-rotate-90'}`} 
            size={16} 
          />
          
          {/* Date Range */}
          <span className="text-sm font-medium text-gray-700">{dateRange}</span>
          
          {/* Separator */}
          <span className="text-xs text-gray-400">•••••</span>
          
          {/* Total Time */}
          <span className="text-sm font-medium text-gray-900">{totalTime}</span>
        </div>
      </button>
      
      {/* Expanded Content */}
      {isExpanded && (
        <div className="bg-gray-50 max-h-64 overflow-y-auto">
          {/* Day Header */}
          <div className="px-6 py-2">
            <div className="text-xs font-medium text-gray-500 mb-2">
              Thursday • Jun 12
            </div>
          </div>
          
          {/* Time Entries List */}
          {entries.map(entry => (
            <TimeEntry 
              key={entry.id} 
              entry={entry} 
              onEdit={onEditEntry}
              onDelete={onDeleteEntry}
              onEditTaskName={onEditTaskName}
              editingTaskId={editingTaskId}
              setEditingTaskId={setEditingTaskId}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default DateSection;