import React, { useState } from 'react';
import { UserCircle2 } from 'lucide-react';

const Header = ({ activeTab, setActiveTab, isLoggedIn, onLogout, onShowLogin, user }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <div className="flex items-center justify-between px-6 py-3 border-b bg-gradient-to-r from-purple-50 to-purple-100">
      {/* Tabs */}
      <div className="flex space-x-8">
        <button
          className={`text-sm font-semibold tracking-wide ${activeTab === 'time' ? 'text-purple-900 border-b-2 border-purple-600' : 'text-gray-600'
            }`}
          onClick={() => setActiveTab('time')}
        >
          My Task
        </button>
        <button
          className={`text-sm font-semibold tracking-wide ${activeTab === 'timesheet' ? 'text-purple-900 border-b-2 border-purple-600' : 'text-gray-600'
            }`}
          onClick={() => setActiveTab('timesheet')}
        >
          Timesheet
        </button>
      </div>

      {/* Avatar & Dropdown */}
      <div className="relative">
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="flex items-center space-x-2 focus:outline-none group"
        >
          {user?.avatar ? (
            <img
              src={user.avatar}
              alt="avatar"
              className="w-9 h-9 rounded-full object-cover border-2 border-purple-300 shadow-sm group-hover:scale-105 transition-transform"
            />
          ) : (
            <UserCircle2 className="w-9 h-9 text-purple-500" />
          )}
          {isLoggedIn && user && (
            <span className="text-sm text-gray-800 font-medium max-w-36 truncate">
              {user.name}
            </span>
          )}
        </button>

        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-[100] bg-white border border-gray-200 rounded-md shadow-lg z-50">
            {isLoggedIn ? (
              <>
                <div className="px-4 py-2 text-sm text-gray-700 font-semibold border-b bg-gray-50">
                  {user?.name}
                </div>
                <button
                  onClick={() => {
                    onLogout();
                    setDropdownOpen(false);
                  }}
                  className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100"
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  onShowLogin();
                  setDropdownOpen(false);
                }}
                className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
              >
                Login
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
