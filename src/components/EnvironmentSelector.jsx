import React from 'react';

const EnvironmentSelector = ({ onSelect }) => {
  return (
    <div className="fixed inset-0 bg-[#090223] bg-opacity-90 flex justify-center items-center z-50 font-sans">
      <div className="bg-white w-[400px] rounded-lg shadow-lg p-8 text-center">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Choose Environment</h2>
        <div className="space-y-4">
          <button
            onClick={() => onSelect('dev')}
            className="w-full bg-white text-purple-800 py-2 rounded-md hover:bg-blue-600"
          >
             Dev
          </button>
          <button
            onClick={() => onSelect('demo')}
            className="w-full bg-white text-purple-800 font-semibold py-2 rounded-md hover:bg-blue-600"
          >
           Demo
          </button>
        </div>
      </div>
    </div>
  );
};

export default EnvironmentSelector;
