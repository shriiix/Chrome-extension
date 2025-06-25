import React from 'react';

const TaskDetailed = ({ tasks }) => {
  return (
    <div>
      {tasks.map((task) => (
        <div
          key={task.id}
          className="p-4 mb-4 border border-gray-200 rounded-lg bg-gray-200 overflow-auto"
        >
          <div className="flex justify-between items-center mb-2 overflow-auto">
            <h3 className="text-lg font-semibold text-gray-800 overflow-auto">
              {task.title}
            </h3>
            <span className="text-sm  text-gray-800 overflow-auto">#{task.id}</span>
          </div>
          <div className="font-semibold  text-gray-800">
            Time Reported: <span className="text-gray-800 font-medium overflow-auto">{task.time}</span>
          </div>
          <div className="text-xs mt-2 text-gray-800 overflow-auto">
            Description: This task involves project management daily activities related to Amdital.
          </div>
        </div>
      ))}
    </div>
  );
};

export default TaskDetailed;
