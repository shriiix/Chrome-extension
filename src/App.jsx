import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import TimerButton from './components/TimerButton';
// import TimerDisplay from './components/TimerDisplay';
// import DateSection from './components/DateSection';
// import EmptyState from './components/EmptyState';

const App = () => {
  // State Management
  const [activeTab, setActiveTab] = useState('time');
  const [searchText, setSearchText] = useState('');
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [isDateExpanded, setIsDateExpanded] = useState(true);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timeEntries, setTimeEntries] = useState([
    {
      id: 1,
      duration: '2m',
      taskName: 'Bug Points of Release-1',
      projectCode: 'CRUE-57',
      projectName: 'CRUE - CP - Rudra ERP',
      projectColor: 'bg-yellow-400'
    }
  ]);

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
  // const handleEditEntry = (entry) => {
  //   console.log('Edit entry:', entry);
  //   // TODO: Implement edit functionality
  // };

  // const handleDeleteEntry = (entryId) => {
  //   setTimeEntries(timeEntries.filter(entry => entry.id !== entryId));
  // };

  // // Filter entries based on search text
  const filteredEntries = timeEntries.filter(entry =>
    entry.taskName.toLowerCase().includes(searchText.toLowerCase()) ||
    entry.projectName.toLowerCase().includes(searchText.toLowerCase())
  );

  // // Calculate total time
  // const totalTime = filteredEntries.reduce((total, entry) => {
  //   const minutes = parseInt(entry.duration.match(/(\d+)m/)?.[1] || 0);
  //   return total + minutes;
  // }, 0);

  return (
    <div className="w-96 h-96 bg-white shadow-lg rounded-sm overflow-hidden">
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
          
          {/* Date Section with Time Entries */}
          {/* <DateSection
            dateRange="Jun, 09 - Jun, 15"
            totalTime={`${totalTime}m`}
            isExpanded={isDateExpanded}
            onToggle={() => setIsDateExpanded(!isDateExpanded)}
            entries={filteredEntries}
            onEditEntry={handleEditEntry}
            onDeleteEntry={handleDeleteEntry}
          /> */}
        </>
      )} 
      
      {/* Other Tabs Content */}
      {/* {activeTab !== 'time' && (
        <EmptyState activeTab={activeTab} />
      )} */}
    </div>
  );
};

export default App;