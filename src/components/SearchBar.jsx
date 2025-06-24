import React from 'react';
import { Search } from 'lucide-react';

const SearchBar = ({ searchText, setSearchText }) => {
  return (
    <div className="p-3 border-b border-gray-100">
      <div className="relative">
        {/* Search Icon */}
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
        
        {/* Search Input */}
        <input
          type="text"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder="Type to find tasks or enter free text"
          className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
        />
      </div>
    </div>
  );
};

export default SearchBar;