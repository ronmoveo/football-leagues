import React from 'react';
import { TabsProps } from '../../types';
import LeagueTeamsView from '../LeagueTeamsView/LeagueTeamsView';
import TeamSearchBar from './TeamSearchBar/TeamSearchBar';
import './Tabs.scss';

const Tabs: React.FC<TabsProps> = ({
  leagues,
  selectedIndex,
  setSelectedIndex,
  isLoadingTeams,
  teams,
  teamSearchTerm,
  setTeamSearchTerm,
  }) => {
  const handleTabClick = (index: number) => {
    setSelectedIndex(index);
    setTeamSearchTerm(''); 
  };

  const handleClearTeamSearch = () => {
    setTeamSearchTerm('');
    
  };

  return (
    <div className="tabs">
      <div className="tab-list">
        {leagues.map((league, index) => (
          <button
            key={league.idLeague}
            className={`tab ${selectedIndex === index ? 'tab--selected' : ''}`}
            onClick={() => handleTabClick(index)}
          >
            {league.strLeague}
          </button>
        ))}
      </div>
      {selectedIndex !== undefined && (
        <div className="tab-content">
          <TeamSearchBar
            teamSearchTerm={teamSearchTerm}
            setTeamSearchTerm={setTeamSearchTerm}
            onClear={handleClearTeamSearch}
          />
          {isLoadingTeams ? (
            <div>Loading teams...</div>
          ) : (
            <LeagueTeamsView teams={teams} />
          )}
        </div>
      )}
    </div>
  );
};

export default Tabs;