import React, { useRef, useEffect, useState } from 'react';
import { MoreHorizontal } from 'lucide-react';

const EditableTaskName = ({ taskName, onSave, isEditing, onEdit }) => {
  const [editValue, setEditValue] = useState(taskName);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleSave = () => {
    onSave(editValue);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      setEditValue(taskName);
      onEdit(false);
    }
  };

  if (isEditing) {
    return (
      <input
        ref={inputRef}
        type="text"
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        onBlur={handleSave}
        onKeyDown={handleKeyPress}
        className="text-sm font-medium text-gray-900 bg-white border border-gray-300 rounded px-2 py-1 w-full focus:outline-none focus:border-green-500"
      />
    );
  }

  return (
    <button
      onClick={() => onEdit(true)}
      className="text-sm font-medium text-gray-900 hover:text-green-600 text-left w-full overflow-auto"
    >
      {taskName}
    </button>
  );
};

const TimeEntry = ({ entry, onEdit, onDelete, onEditTaskName, editingTaskId, setEditingTaskId }) => {
  const [showMenu, setShowMenu] = useState(false);
  const isEditing = editingTaskId === entry.id;

  const handleTaskNameSave = (newName) => {
    onEditTaskName(entry.id, newName);
    setEditingTaskId(null);
  };

  return (
    <div className="flex items-center justify-between py-3 px-4 hover:bg-gray-50 group">
      <div className="flex items-center space-x-3">
        <div className="text-sm font-medium text-gray-600 w-8">{entry.duration}</div>
        <div className={`w-2 h-2 rounded-full ${entry.projectColor}`}></div>
        <div className="flex-1">
          <div className="text-sm font-medium text-gray-900">
            <EditableTaskName
              taskName={entry.taskName}
              onSave={handleTaskNameSave}
              isEditing={isEditing}
              onEdit={(editing) => setEditingTaskId(editing ? entry.id : null)}
            />
          </div>
          <div className="text-xs text-gray-500">
            {entry.projectCode} • {entry.projectName}
          </div>
        </div>
      </div>

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
  );
};

export default TimeEntry;
