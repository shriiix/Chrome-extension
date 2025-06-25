import React from 'react';

const EmptyState = ({ activeTab }) => {
  return (
    <div className="flex items-center justify-center h-64 text-gray-500">
      <div className="text-center">
        <div className="text-lg font-medium mb-2">
          {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
        </div>
        <div className="text-sm">
          This section is coming soon!
        </div>
      </div>
    </div>
  );
};

export default EmptyState;