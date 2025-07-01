import React from 'react'

const TaskCompact = ({ tasks = [] }) => {
  return (
    <div>
      {tasks.map((task) => (
        <div
          key={tasks.id}
          className=' flex justify-between p-3  border-gray-700 hover:bg-gray-300 rounded overflow-visible'>
          <span className='text-gray-800 font-semibold'>
            {task.taskName}<br /> {task.projectName}<span className="font-semibold text-gray-800 text-sm "><br />Task: {task.id}</span>
          </span>
          <span className=' font-medium'>{task.duration}</span>
        </div>
      ))}
    </div>
  )
}

export default TaskCompact