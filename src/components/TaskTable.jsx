import React, { useState, useMemo } from 'react';
import TimeEntry from './TimeEntry';
import downArray from '../assets/down_array.svg';

// Group tasks by status/category
const groupByStatus = (tasks) => {
  const groups = {};
  tasks.forEach(task => {
    const status = task.taskStatues?.nodes?.[0];
    const statusId = status?.id || 'uncategorized';
    const statusName = status?.name || 'Uncategorized';
    if (!groups[statusId]) {
      groups[statusId] = { name: statusName, tasks: [] };
    }
    groups[statusId].tasks.push(task);
  });
  return groups;
};

const TaskTable = ({ tasks, onTimerClick }) => {
  // Group tasks by status/category
  const grouped = useMemo(() => groupByStatus(tasks), [tasks]);
  const statusIds = Object.keys(grouped);

  // Track open/closed state for each category
  const [openCategories, setOpenCategories] = useState(() =>
    statusIds.reduce((acc, id) => ({ ...acc, [id]: true }), {})
  );

  const toggleCategory = (id) => {
    setOpenCategories(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="w-full">
      {/* Table header */}
      <div className="grid grid-cols-5 border-b border-[#E1DCFF] bg-gray-200">
        <div className="col-span-2 px-5 py-2 font-semibold text-[#26212E]">Task Name</div>
        <div className="text-center px-3 py-2 font-semibold text-[#26212E]">Due Date</div>
        <div className="text-center px-4 py-2 font-semibold text-[#26212E]">Tags</div>
        <div className="text-center px-4 py-2 font-semibold text-[#26212E]">Status</div>
      </div>

      {/* Grouped Tasks by Status */}
      {statusIds.map((statusId) => {
        const group = grouped[statusId];
        return (
          <div key={statusId} className="mb-6">
            <div
              className="flex items-center cursor-pointer text-base font-bold text-[#26212E] mt-4 mb-2 pl-4 pt-2"
              onClick={() => toggleCategory(statusId)}
            >
              <img
                src={downArray}
                alt="toggle"
                className={`w-4 h-4 mr-2 transition-transform duration-200 ${openCategories[statusId] ? 'rotate-30' : ''}`}
              />
              {group.name}
              <span className="ml-2 px-2 py-0.5 rounded bg-[#F8F7FC] text-xs font-bold text-[#FF845C]">
                {group.tasks.length.toString().padStart(2, '0')}
              </span>
            </div>
            {openCategories[statusId] && group.tasks.map((task) => (
              <TimeEntry
                key={task.id}
                taskName={task.title}
                dueDate={task.taskFields?.dueDate}
                tags={task.taskTags?.nodes || []}
                status={task.taskStatues?.nodes?.[0] || {}}
                timerMinutes={task.timerMinutes || 0}
                onTimerClick={() => onTimerClick(task)}
              />
            ))}
          </div>
        );
      })}
    </div>
  );
};

export default TaskTable;
