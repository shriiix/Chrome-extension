import React from 'react';
import { Clock, FileText, Calendar, Timer } from 'lucide-react';

const Header = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'time', label: 'Time ', icon: Clock },
    { id: 'report', label: 'Report ', icon: FileText },
    { id: 'timesheet', label: 'Timesheet ', icon: Calendar },
    { id: 'timers', label: 'Timers ', icon: Timer }
  ];

  return (
    <div className="flex items-center justify-between p-3 py-5 bg-white border-b border-gray-200">
      <div className="flex items-center space-x-6">
        {/* Logo */}
        <div className="w-8 h-8  bg-orange-500 rounded-full flex items-center justify-center">
          <div className="w-4 h-4 bg-white rounded-full"></div>
        </div>
        
        {/* Navigation Tabs */}
        <nav className="flex space-x-4">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-1 text-sm font-medium pb-2 border-b-2 transition-colors ${
                  activeTab === tab.id 
                    ? 'text-green-600 border-green-600' 
                    : 'text-gray-500 border-transparent hover:text-gray-700'
                }`}
              >
                <Icon size={16} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
      
      {/* User Avatar */}
      <div className="w-8 h-8 bg-gray-300 rounded-full overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face" 
          alt="User" 
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
};

export default Header;