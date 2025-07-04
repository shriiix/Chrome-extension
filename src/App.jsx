// ✅ App.jsx
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import DateSection from './components/DateSection';
import Report from './components/Report/Report';
import TimesheetUI from './components/Timesheet/TimeSheetUi';
import LoginModal from './components/LoginModal';
import EnvironmentSelector from './components/EnvironmentSelector';
import { fetchTasks, logoutUser } from './services/auth';
import TimeEntry from './components/TimeEntry';
import TaskTable from './components/TaskTable';

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
  const [dateSections, setDateSections] = useState([]);
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
    const lowerSearch = searchText.toLowerCase();

    return (
      taskName.toLowerCase().includes(lowerSearch) ||
      projectName.toLowerCase().includes(lowerSearch)
    );
  });

  const totalTime = filteredEntries.reduce((total, entry) => {
    const duration = entry.duration || '';
    const match = duration.match(/(\d+)m/);
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
    <div className="w-[600px] h-[600px] background_color shadow-lg rounded-sm font-albert">
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
              {isLoggedIn ? (
                <div className="px-4">
                  <TaskTable
                    tasks={filteredEntries.map((task, idx) => ({
                      ...task,
                      // Mock timer: only first task running for demo
                      timerRunning: idx === 0,
                      timerValue: idx === 0 ? '119:38:08' : '',
                    }))}
                    onTimerClick={(task) => {
                      // TODO: Implement timer start/stop logic here
                      alert(`Timer clicked for task: ${task.title}`);
                    }}
                  />
                </div>
              ) : (
                <div className="p-4 text-center text-gray-500">
                  Please login to view your tasks.
                </div>
              )}
            </>
          )}

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
