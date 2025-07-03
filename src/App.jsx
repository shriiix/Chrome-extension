// ✅ App.jsx
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import TimerButton from './components/TimerButton';
import TimerDisplay from './components/TimerDisplay';
import DateSection from './components/DateSection';
import Report from './components/Report/Report';
import TimesheetUI from './components/Timesheet/TimeSheetUi';
import LoginModal from './components/LoginModal';
import EnvironmentSelector from './components/EnvironmentSelector';
import { fetchTasks, logoutUser } from './services/auth';

const getCurrentWeekRange = () => {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const start = new Date(now);
  const end = new Date(now);
  start.setDate(now.getDate() - ((dayOfWeek + 6) % 7));
  end.setDate(start.getDate() + 6);

  const format = (date) =>
    new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: '2-digit',
    }).format(date);

  return `${format(start)} - ${format(end)}`;
};

const App = () => {
  const [activeTab, setActiveTab] = useState('time');
  const [searchText, setSearchText] = useState('');
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [dateSections, setDateSections] = useState([]);
  const [isDateExpanded, setIsDateExpanded] = useState(true);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showSelector, setShowSelector] = useState(false);
  const [timeEntries, setTimeEntries] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoadingTasks, setIsLoadingTasks] = useState(false);

  useEffect(() => {
    chrome.storage.local.get(['accessToken', 'user', 'selectedAppSite'], (result) => {
      if (result.accessToken && result.user) {
        setCurrentUser(result.user);
        setIsLoggedIn(true);
        setShowLogin(false);
        if (!result.selectedAppSite) {
          setShowSelector(true);
        }
      } else {
        setShowLogin(true);
      }
    });
  }, []);

  useEffect(() => {
    if (currentUser?.userId) {
      setIsLoadingTasks(true);
      fetchTasks().then((tasks) => {
        setTimeEntries(Array.isArray(tasks) ? tasks : []);
        setIsLoadingTasks(false);
      });
    }
  }, [currentUser]);

  useEffect(() => {
    const defaultRange = getCurrentWeekRange();
    setDateSections([defaultRange]);
  }, []);
  
  useEffect(() => {
    let interval;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}m ${secs}s`;
  };

  const handleTimerToggle = () => {
    if (isTimerRunning && timerSeconds > 0) {
      const newEntry = {
        id: Date.now(),
        userId: currentUser?.userId?.toString() || '',
        duration: formatTime(timerSeconds),
        taskName: searchText || 'New Task',
        projectCode: 'NEW-01',
        projectName: 'Current Project',
        projectColor: 'bg-blue-400',
      };
      setTimeEntries([newEntry, ...timeEntries]);
      setTimerSeconds(0);
      setSearchText('');
    }
    setIsTimerRunning(!isTimerRunning);
  };

  const handleDeleteEntry = (entryId) => {
    setTimeEntries(timeEntries.filter((entry) => entry.id !== entryId));
  };

  const handleEditTaskName = (entryId, newTaskName) => {
    setTimeEntries(
      timeEntries.map((entry) =>
        entry.id === entryId ? { ...entry, taskName: newTaskName } : entry
      )
    );
  };

  const filteredEntries = timeEntries.filter((entry) => {
    const taskName = entry.taskName || entry.title || '';
    const projectName = entry.projectName || '';

    return taskName.toLowerCase().includes(searchText.toLowerCase()) ||
      projectName.toLowerCase().includes(searchText.toLowerCase());
  });


  const totalTime = filteredEntries.reduce((total, entry) => {
  const duration = entry.duration || ''; // fallback
  const match = duration.match(/(\\d+)m/);
  const minutes = match ? parseInt(match[1]) : 0;
  return total + minutes;
}, 0);


  const handleLogout = () => {
    logoutUser();
    setIsLoggedIn(false);
    setShowLogin(true);
    setShowSelector(false);
    setTimeEntries([]);
    setCurrentUser(null);
  };

  const handleLoginSuccess = (success, user) => {
    if (success) {
      setCurrentUser(user);
      setIsLoggedIn(true);
      setShowLogin(false);
      setShowSelector(true);
    } else {
      setShowLogin(false);
    }
  };

  const handleEnvironmentSelected = (mode) => {
    const site = mode === 'dev'
      ? 'https://app-amdital.dev.diginnovators.site'
      : 'https://app-amdital.dev.diginnovators.site/dashboard';

    chrome.storage.local.set({ selectedAppSite: site }, () => {
      console.log('✅ Selected site stored:', site);
      setShowSelector(false);
    });
  };

  return (
    <div className="w-[600px] h-[600px] bg-white shadow-lg rounded-sm">
      {showLogin && <LoginModal onClose={handleLoginSuccess} />}
      {showSelector && <EnvironmentSelector onSelect={handleEnvironmentSelected} />}

      {!showLogin && !showSelector && (
        <>
          <Header
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            isLoggedIn={isLoggedIn}
            onLogout={handleLogout}
            onShowLogin={() => setShowLogin(true)}
            user={currentUser}
          />

          {activeTab === 'time' && (
            <>
              <SearchBar searchText={searchText} setSearchText={setSearchText} />
              <TimerButton isRunning={isTimerRunning} onToggle={handleTimerToggle} />
              {isTimerRunning && <TimerDisplay timerSeconds={timerSeconds} formatTime={formatTime} />}

              {isLoggedIn ? (
                <>
                  {dateSections.map((range, index) => (
                    <DateSection
                      key={index}
                      DateSection={range}
                      totalTime={`${totalTime}m`}
                      isExpanded={isDateExpanded}
                      onToggle={() => setIsDateExpanded(!isDateExpanded)}
                      entries={filteredEntries}
                      onDeleteEntry={handleDeleteEntry}
                      onEditTaskName={handleEditTaskName}
                      editingTaskId={editingTaskId}
                      setEditingTaskId={setEditingTaskId}
                    />
                  ))}
                  {filteredEntries.length === 0 && (
                    <div className="p-4 text-center text-gray-500">
                      No tasks found. Start a timer to create your first task!
                    </div>
                  )}
                </>
              ) : (
                <div className="p-4 text-center text-gray-500">
                  Please login to view your tasks.
                </div>
              )}
            </>
          )}

          {/* {activeTab === 'report' && (
            <Report
              userName={currentUser?.name || ''}
              timeEntries={timeEntries}
              searchText={searchText}
              setSearchText={setSearchText}
            />
          )} */}

          {activeTab === 'timesheet' && (
            <div className="App">
              <TimesheetUI />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default App;
