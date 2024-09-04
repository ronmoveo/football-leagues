import React from 'react';
import './HeaderSearchBar.scss';

interface HeaderSearchBarProps {
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
}

const HeaderSearchBar: React.FC<HeaderSearchBarProps> = ({ searchTerm, setSearchTerm }) => {
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
    </div>
  );
};

export default HeaderSearchBar;
