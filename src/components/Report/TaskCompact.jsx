import React from 'react'

const TaskCompact = ({tasks =[]}) => {
  return (
    <div>
        {tasks.map((task)=>(
            <div
            key = {tasks.id}
            className=' flex justify-between p-3 border-b border-gray-700 hover:bg-gray-300 rounded overflow-auto'>
              <span className='text-gray-800 font-semibold'>
                    {task.title} <span className="text-gray-800"><br/>Task Id:- {task.id}</span>
                </span>  
                <span className='font-medium'>{tasks.time}</span>
            </div>
        ))}
    </div>
  )
}

export default TaskCompact