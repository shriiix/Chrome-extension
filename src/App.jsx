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
  const [timeEntries, setTimeEntries] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoadingTasks, setIsLoadingTasks] = useState(false);
  const[handleShowLogin] = useState()

  // ✅ On load: check if user is already logged in
  useEffect(() => {
    const checkAuthStatus = async () => {
      if (typeof chrome !== 'undefined' && chrome.storage) {
        chrome.storage.local.get(['accessToken', 'user'], (result) => {
          console.log("Chrome storage on load:", result);
          if (result.accessToken && result.user) {
            setCurrentUser(result.user);
            setIsLoggedIn(true);
            setShowLogin(false);
          } else {
            setIsLoggedIn(false);
            setShowLogin(true);
          }
        });
      } else {
        const accessToken = localStorage.getItem('accessToken');
        const userStr = localStorage.getItem('user');
        console.log("LocalStorage on load:", { accessToken, userStr });
        
        if (accessToken && userStr) {
          try {
            const user = JSON.parse(userStr);
            setCurrentUser(user);
            setIsLoggedIn(true);
            setShowLogin(false);
          } catch (error) {
            console.error("Error parsing user data:", error);
            setIsLoggedIn(false);
            setShowLogin(true);
          }
        } else {
          setIsLoggedIn(false);
          setShowLogin(true);
        }
      }
    };

    checkAuthStatus();
  }, []);

  // ✅ Fetch tasks when user changes
  useEffect(() => {
    const loadUserTasks = async () => {
      console.log("🚀 loadUserTasks called with currentUser:", currentUser);
      
      if (currentUser?.id) {
        console.log("✅ User has ID, loading tasks for user:", currentUser);
        setIsLoadingTasks(true);
        
        try {
          const tasks = await fetchTasks();
          console.log("📋 Fetched tasks result:", tasks);
          console.log("📋 Tasks is array?", Array.isArray(tasks));
          console.log("📋 Tasks length:", tasks?.length);
          
          if (Array.isArray(tasks)) {
            console.log("✅ Setting timeEntries to:", tasks);
            setTimeEntries(tasks);
          } else {
            console.warn("⚠️ Tasks is not an array:", tasks);
            setTimeEntries([]);
          }
        } catch (error) {
          console.error("❌ Error loading tasks:", error);
          setTimeEntries([]);
        } finally {
          setIsLoadingTasks(false);
          console.log("✅ Loading tasks completed");
        }
      } else {
        console.log("❌ No current user or user has no ID, clearing tasks. User:", currentUser);
        setTimeEntries([]);
        setIsLoadingTasks(false);
      }
    };

    loadUserTasks();
  }, [currentUser]);

  // ✅ Set default date range
  useEffect(() => {
    const defaultRange = getCurrentWeekRange();
    setDateSections([defaultRange]);
  }, []);

  // ✅ Timer logic
  useEffect(() => {
    let interval;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev + 1);
      }, 1000);
    }
    const handleShowLogin = () => {
    setShowLogin(true);
  };

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
        userId: currentUser?.id?.toString() || '',
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

  const filteredEntries = timeEntries.filter(
    (entry) =>
      entry.taskName.toLowerCase().includes(searchText.toLowerCase()) ||
      entry.projectName.toLowerCase().includes(searchText.toLowerCase())
  );

  const totalTime = filteredEntries.reduce((total, entry) => {
    const minutes = parseInt(entry.duration.match(/(\d+)m/)?.[1] || 0);
    return total + minutes;
  }, 0);

  const handleLogout = () => {
    console.log("Logging out user");
    logoutUser();
    setIsLoggedIn(false);
    setShowLogin(true);
    setTimeEntries([]);
    setCurrentUser(null);
  };

  const handleLoginSuccess = (success, user) => {
    if (success) {
      console.log("🎉 Login successful, retrieving user from storage");
      
      // Add a small delay to ensure storage operation completes
      setTimeout(() => {
        if (typeof chrome !== 'undefined' && chrome.storage) {
          chrome.storage.local.get(['user', 'accessToken'], (result) => {
            console.log("📦 Retrieved data from Chrome storage:", result);
            if (result.user && result.accessToken) {
              console.log("✅ Setting currentUser to:", result.user);
              setCurrentUser(result.user);
              setIsLoggedIn(true);
              setShowLogin(false);
            } else {
              console.error("❌ Missing user or accessToken in Chrome storage:", result);
            }
          });
        } else {
          const userStr = localStorage.getItem('user');
          const accessToken = localStorage.getItem('accessToken');
          console.log("💾 Retrieved from localStorage - user:", userStr, "accessToken:", accessToken);
          
          if (userStr && accessToken) {
            try {
              const userData = JSON.parse(userStr);
              console.log("✅ Setting currentUser to:", userData);
              setCurrentUser(userData);
              setIsLoggedIn(true);
              setShowLogin(false);
            } catch (error) {
              console.error("❌ Error parsing user data:", error);
            }
          } else {
            console.error("❌ Missing user or accessToken in localStorage");
          }
        }
      }, 200); // Wait 200ms for storage to complete
    } else {
      setShowLogin(false); // Close modal on cancel
    }
  };

  const handleRefreshTasks = async () => {
    console.log("🔄 Manual refresh tasks triggered");
    if (currentUser?.id) {
      setIsLoadingTasks(true);
      try {
        const tasks = await fetchTasks();
        console.log("🔄 Manual refresh - fetched tasks:", tasks);
        setTimeEntries(Array.isArray(tasks) ? tasks : []);
      } catch (error) {
        console.error("🔄 Manual refresh - error:", error);
        setTimeEntries([]);
      } finally {
        setIsLoadingTasks(false);
      }
    }
  };

  return (
    <div className="w-[600px] h-[600px] bg-white shadow-lg rounded-sm">
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isLoggedIn={isLoggedIn}
        onLogout={handleLogout}
        onShowLogin={handleShowLogin}
        user={currentUser}
      />

      {showLogin && (
        <LoginModal onClose={handleLoginSuccess} />
      )}

      {activeTab === 'time' && (
        <>
          <SearchBar searchText={searchText} setSearchText={setSearchText} />
          <TimerButton isRunning={isTimerRunning} onToggle={handleTimerToggle} />
          
          {isTimerRunning && (
            <TimerDisplay
              timerSeconds={timerSeconds}
              formatTime={formatTime}
            />
          )}

          {/* Debug Panel */}
          {isLoggedIn && (
            <div className="px-4 py-2 bg-gray-50 border-b text-xs">
              <div>User: {currentUser?.name || currentUser?.email || 'No user'}</div>
              <div>User ID: {currentUser?.id || 'No ID'}</div>
              <div>Tasks: {timeEntries.length}</div>
              <button 
                onClick={handleRefreshTasks}
                className="bg-blue-500 text-white px-2 py-1 rounded text-xs mt-1"
                disabled={isLoadingTasks}
              >
                {isLoadingTasks ? 'Loading...' : 'Refresh Tasks'}
              </button>
            </div>
          )}

          {isLoadingTasks && (
            <div className="p-4 text-center text-gray-500">
              Loading tasks...
            </div>
          )}

          {!isLoadingTasks && isLoggedIn && (
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
              
              {filteredEntries.length === 0 && !isLoadingTasks && (
                <div className="p-4 text-center text-gray-500">
                  No tasks found. Start a timer to create your first task!
                </div>
              )}
            </>
          )}

          {!isLoggedIn && !showLogin && (
            <div className="p-4 text-center text-gray-500">
              Please login to view your tasks.
            </div>
          )}
        </>
      )}

      {activeTab === 'report' && (
        <Report
          userName={currentUser?.name || ''}
          timeEntries={timeEntries}
          searchText={searchText}
          setSearchText={setSearchText}
        />
      )}

      {activeTab === 'timesheet' && (
        <div className="App">
          <TimesheetUI />
        </div>
      )}
    </div>
  );
};

export default App;