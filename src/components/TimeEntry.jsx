import React from 'react';

// Define the columns for the Chrome Extension's task table
const columns = [
  {
    key: 'task',
    render: ({ taskName, selected, onSelect, onTimerClick, timerRunning }) => (
      <div className="flex items-start gap-3 px-6 py-3">
        {/* Checkbox */}
        <span className="mt-1">
          {selected ? (
            <span className="inline-block w-5 h-5 rounded-full border-2 border-[#00B656] bg-white flex items-center justify-center">
              <svg className="w-3 h-3 text-[#00B656]" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
            </span>
          ) : (
            <input
              type="checkbox"
              checked={selected}
              onChange={onSelect}
              className="w-5 h-5 rounded-full border-2 border-[#DCD6FF] text-[#806BFF] focus:ring-0"
            />
          )}
        </span>
        {/* Task Name */}
        <span className="block truncate max-w-[220px]">{taskName}</span>
        {/* Timer */}
        <span className="ml-auto ">
          <div
            onClick={onTimerClick}
            className={`w-[18px] h-[18px] rounded-full flex items-center justify-center cursor-pointer transition-colors duration-200
              ${timerRunning ? 'bg-[#FF0000]' : 'bg-[#DCD6FF] hover:bg-[#008D43]'}
            `}
            title={timerRunning ? 'Stop Timer' : 'Start Timer'}
          >
            <img
              src={process.env.PUBLIC_URL + '/assets/images/amdital/task_new/play_icon_white.svg'}
              alt="play"
              className="w-3 h-3"
              draggable="false"
            />
          </div>
        </span>
      </div>
    ),
    className: 'col-span-2',
  },
  {
    key: 'dueDate',
    render: ({ dueDate, formatDueDate }) => (
      <div className="text-center px-4 py-3">{formatDueDate(dueDate)}</div>
    ),
  },
  {
    key: 'tags',
    render: ({ tags }) => (
      <div className="flex flex-wrap gap-1 justify-center px-4 py-3">
        {tags.map((tag) => (
          <span key={tag.id || tag.name} style={{ background: tag.description }} className="px-2 py-0.5 rounded-full text-xs font-semibold text-white">
            {tag.name}
          </span>
        ))}
      </div>
    ),
  },
  {
    key: 'status',
    render: ({ status }) => (
      <div className="text-center px-4 py-3">
        {status?.name ? (
          <span className="inline-flex items-center gap-1 justify-center">
            <span className="w-2 h-2 rounded-full" style={{ background: status.description || '#E1DCFF' }}></span>
            <span className="text-xs font-semibold text-[#26212E]">{status.name}</span>
          </span>
        ) : (
          <span className="text-[#B9B4C8] text-xs font-semibold">Select Status</span>
        )}
      </div>
    ),
  },
];

const TimeEntry = (props) => {
  const formatDueDate = (date) => {
    if (!date) return '--';
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
  };

  return (
    <div className="grid grid-cols-5 items-center border border-[#E1DCFF] bg-white hover:bg-[#F8F7FC] font-albert font-semibold">
      {columns.map((col, idx) => {
        // Only add right border except for the last column
        let borderClass = '';
        if (idx !== columns.length - 1) borderClass = 'border-r border-[#E1DCFF]';
        if (col.className) borderClass += ' ' + col.className;
        return (
          <div key={col.key} className={borderClass}>
            {col.render({ ...props, formatDueDate })}
          </div>
        );
      })}
    </div>
  );
};

export default TimeEntry;
