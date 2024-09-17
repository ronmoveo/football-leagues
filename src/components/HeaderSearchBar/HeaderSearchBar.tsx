import React from 'react';
import './HeaderSearchBar.scss';
import {HeaderSearchBarProps} from  '../../types';


const HeaderSearchBar: React.FC<HeaderSearchBarProps> = ({ searchTerm, setSearchTerm }) => {
  const clearSearch = () => {
    setSearchTerm('');
  };

  return (
    <div className="header-search-bar">
      <h1>Football Leagues</h1>
      <input
        type="text"
        placeholder="Search by league..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
      />
      <button onClick={clearSearch} className="clear-button">Clear</button>
    </div>
  );
};

export default HeaderSearchBar;
