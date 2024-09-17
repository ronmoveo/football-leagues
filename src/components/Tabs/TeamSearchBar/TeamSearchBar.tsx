import React from 'react';
import './TeamSearchBar.scss';

interface TeamSearchBarProps {
  teamSearchTerm: string;
  setTeamSearchTerm: (term: string) => void;
  onClear: () => void;
}

const TeamSearchBar: React.FC<TeamSearchBarProps> = ({ teamSearchTerm, setTeamSearchTerm, onClear }) => {
  return (
    <div className="team-search-bar">
      <input
        type="text"
        placeholder="Search teams..."
        value={teamSearchTerm}
        onChange={(e) => setTeamSearchTerm(e.target.value)}
        className="search-input"
      />
      <button onClick={onClear} className="clear-button">Clear</button>
    </div>
  );
};

export default TeamSearchBar;