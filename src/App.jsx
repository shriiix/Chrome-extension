import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import TimerButton from './components/TimerButton';
import TimerDisplay from './components/TimerDisplay';
import DateSection from './components/DateSection';
import EmptyState from './components/EmptyState ';



const getCurrentWeekRange = () => {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const start = new Date(now);
  const end = new Date(now);
  start.setDate(now.getDate() - ((dayOfWeek + 6) % 7));
  end.setDate(start.getDate() + 6);

  const format = (date) =>
    new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "2-digit",
    }).format(date);

  return `${format(start)} - ${format(end)}`;
};

const App = () => {
  // State Management
  const [activeTab, setActiveTab] = useState('time');
  const [searchText, setSearchText] = useState('');
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [dateRange, setDateRange] = useState("");
  const [expandedMap, setExpandedMap] = useState({});
  const [timeEntriesMap, setTimeEntriesMap] = useState({});
  const [dateSections, setDateSections] = useState([]);
  const [isDateExpanded, setIsDateExpanded] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [timeEntries, setTimeEntries] = useState([
    {
      id: 1,
      duration: '2m',
      taskName: 'Bug Points of Release-1',
      projectCode: 'CRUE-57',
      projectName: 'CRUE - CP - Rudra ERP',
      projectColor: 'bg-yellow-400'
    },
    {
      id: 2,
      duration: '4m',
      taskName: 'Bug Points of Release-1',
      projectCode: 'TTSS-1',
      projectName: 'TTSS - CP - MASS ERP',
      projectColor: 'bg-red-500'
    }
    
  ]);


  useEffect(() => {
  const defaultRange = getCurrentWeekRange();
  setDateSections([defaultRange]);
  setExpandedMap({ [defaultRange]: true });
  setTimeEntriesMap({ [defaultRange]: [] });
}, []);

  // Timer Effect - Runs when timer is active
  useEffect(() => {
    let interval;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimerSeconds(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  // // Utility function to format time
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}m ${secs}s`;
  };

  // Timer toggle handler
  const handleTimerToggle = () => {
    if (isTimerRunning) {
      // Stop timer and create entry
      if (timerSeconds > 0) {
        const newEntry = {
          id: Date.now(),
          duration: formatTime(timerSeconds),
          taskName: searchText || 'New Task',
          projectCode: 'NEW-01',
          projectName: 'Current Project',
          projectColor: 'bg-blue-400'
        };
        setTimeEntries([newEntry, ...timeEntries]);
        setTimerSeconds(0);
        setSearchText('');
      }
    }
    setIsTimerRunning(!isTimerRunning);
  };

  // Entry management handlers
  const handleEditEntry = (entry) => {
    console.log('Edit entry:', entry);
    // TODO: Implement edit functionality
  };

  const handleDeleteEntry = (entryId) => {
    setTimeEntries(timeEntries.filter(entry => entry.id !== entryId));
  };

  // // Filter entries based on search text
  const filteredEntries = timeEntries.filter(entry =>
    entry.taskName.toLowerCase().includes(searchText.toLowerCase()) ||
    entry.projectName.toLowerCase().includes(searchText.toLowerCase())
  );

  // // Calculate total time
  const totalTime = filteredEntries.reduce((total, entry) => {
    const minutes = parseInt(entry.duration.match(/(\d+)m/)?.[1] || 0);
    return total + minutes;
  }, 0);

  const handleEditTaskName = (entryId, newTaskName) => {
  setTimeEntries(timeEntries.map(entry => 
    entry.id === entryId 
      ? { ...entry, taskName: newTaskName }
      : entry
  ));
  //   const handleAddDateRange = () => {
  //     const newRange = getCurrentWeekRange();
  //     if (!dateSections.includes(newRange)) {
  //       setDateSections([...dateSections, newRange]);
  //     }
  // }
  
};


  return (
    <div className="w-[450px] h-[500px] bg-white shadow-lg rounded-sm overflow-hidden ">
      {/* Header Navigation */}
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />
      
      {/* Time Tab Content */}
      {activeTab === 'time' && (
        <>
          {/* Search Bar */}
          <SearchBar searchText={searchText} setSearchText={setSearchText} />
          
          {/* Timer Button */}
          <TimerButton isRunning={isTimerRunning} onToggle={handleTimerToggle} />
          
          {/* Running Timer Display */}
          {isTimerRunning && (
            <TimerDisplay timerSeconds={timerSeconds} formatTime={formatTime} />
          )}
          
          {/* <button
            onClick={() => {
              const newRange = getCurrentWeekRange();
              if (!dateSections.includes(newRange)) {
                setDateSections([...dateSections, newRange]);
              }
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500"
          >
            + 
          </button> */}
          
          {/* Date Section with Time Entries */}
          {/* <DateSection
            dateRange={dateRange}
            totalTime={`${totalTime}m`}
            isExpanded={isDateExpanded}
            onToggle={() => setIsDateExpanded(!isDateExpanded)}
            entries={filteredEntries}
            onEditEntry={handleEditEntry}
            onDeleteEntry={handleDeleteEntry}
            onEditTaskName={handleEditTaskName}
            editingTaskId={editingTaskId}
            setEditingTaskId={setEditingTaskId}
          /> */}
          {dateSections.map((range, index) => (
            <DateSection
              key={index}
              DateSection={range}
              totalTime={`${totalTime}m`}
              isExpanded={isDateExpanded}
              onToggle={() => setIsDateExpanded(!isDateExpanded)}
              entries={filteredEntries}
              onEditEntry={handleEditEntry}
              onDeleteEntry={handleDeleteEntry}
              onEditTaskName={handleEditTaskName}
              editingTaskId={editingTaskId}
              setEditingTaskId={setEditingTaskId}
            />
          ))}
        </>
      )} 
      
      {/* Other Tabs Content */}
      {activeTab !== 'time' && (
        <EmptyState activeTab={activeTab} />
      )}
    </div>
  );
};

export default App;