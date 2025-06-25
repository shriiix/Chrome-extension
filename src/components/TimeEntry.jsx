import React, { useEffect, useState } from 'react';
import { MoreHorizontal } from 'lucide-react';

const EditableTaskName = ({taskName, onSave, isEditing, onEdit})=>{
  const [editValue,  SetEditValue] = useState(taskName);
  const inputRef  = useRef(null);
  useEffect(()=>{
    if(isEditing && inputRef.current){
      inputRef.current.focus();
      inputRef.current.select();
    }
  }[isEditing],
)
}






const TimeEntry = ({ entry, onEdit, onDelete }) => {
  const [showMenu, setShowMenu] = useState(false);
  
  return (
    <div className="flex items-center justify-between py-3 px-4 hover:bg-gray-50 group">
      {/* Time Entry Details */}
      <div className="flex items-center space-x-3">
        {/* Duration */}
        <div className="text-sm font-medium text-gray-600 w-8">
          {entry.duration}
        </div>
        
        {/* Project Color Indicator */}
        <div className={`w-2 h-2 rounded-full ${entry.projectColor}`}></div>
        
        {/* Task and Project Information */}
        <div className="flex-1">
          <div className="text-sm font-medium text-gray-900">
            {entry.taskName}
          </div>
          <div className="text-xs text-gray-500">
            {entry.projectCode} • {entry.projectName}
          </div>
        </div>
      </div>
      
      {/* Actions Menu */}
      <div className="relative">
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="p-1 text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <MoreHorizontal size={16} />
        </button>
        
        {/* Dropdown Menu */}
        {showMenu && (
          <div className="absolute right-0 mt-1 w-32 bg-white border border-gray-200 rounded-md shadow-lg z-10">
            <button
              onClick={() => {
                onEdit(entry);
                setShowMenu(false);
              }}
              className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
            >
              Edit
            </button>
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
  );
};

export default TimeEntry;