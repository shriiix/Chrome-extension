import React, { useState } from 'react';
import { UserCircle2 } from 'lucide-react';

const Header = ({ activeTab, setActiveTab, isLoggedIn, onLogout, onShowLogin, user }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <div className="flex items-center justify-between px-4 py-2 border-b">
      {/* Tabs */}
      <div className="flex space-x-6">
        <button
          className={`text-sm font-medium ${activeTab === 'time' ? 'text-green-600' : 'text-gray-600'}`}
          onClick={() => setActiveTab('time')}
        >
          Time
        </button>
        {/* <button
          className={`text-sm font-medium ${activeTab === 'report' ? 'text-green-600' : 'text-gray-600'}`}
          onClick={() => setActiveTab('report')}
        >
          Report
        </button> */}
        <button
          className={`text-sm font-medium ${activeTab === 'timesheet' ? 'text-green-600' : 'text-gray-600'}`}
          onClick={() => setActiveTab('timesheet')}
        >
          Timesheet
        </button>
      </div>

      {/* Avatar & Dropdown */}
      <div className="relative">
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="flex items-center space-x-2 focus:outline-none"
        >
          {user?.avatar ? (
            <img
              src={user.avatar}
              alt="avatar"
              className="w-8 h-8 rounded-full object-cover border"
            />
          ) : (
            <UserCircle2 className="w-8 h-8 text-gray-400" />
          )}
          {isLoggedIn && user && (
            <span className="text-sm text-gray-700 max-w-20 truncate">
              {user.name || user.email}
            </span>
          )}
        </button>

        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-36 bg-white border border-gray-200 rounded-md shadow-lg z-20">
            {isLoggedIn ? (
              <>
                <div className="px-4 py-2 text-sm text-gray-600 border-b">
                  {user?.name || user?.email || 'User'}
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