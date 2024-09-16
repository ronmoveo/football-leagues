import React from 'react';
import { League } from '../../types';
import LeagueTeamsView from '../LeagueTeamsView/LeagueTeamsView';
import './Tabs.scss';

interface TabsProps {
  leagues: League[];
  selectedIndex: number | undefined;
  setSelectedIndex: React.Dispatch<React.SetStateAction<number | undefined>>;
  isLoadingTeams: boolean;
}

const Tabs: React.FC<TabsProps> = ({ leagues, selectedIndex, setSelectedIndex, isLoadingTeams }) => {
  
  return (
    <div>
      <div className="tab-list">
        {leagues.map((league, index) => (
          <button
            key={league.idLeague}
            className={`tab ${selectedIndex === index ? 'tab--selected' : ''}`}
            onClick={() => setSelectedIndex(index)}
          >
            {league.strLeague}
          </button>  
        ))}
      </div>
      {selectedIndex !== undefined && leagues[selectedIndex] && (
        isLoadingTeams ? (
          <div className="loader">Loading teams...</div>
        ) : (
          <LeagueTeamsView teams={leagues[selectedIndex].teams} />
        )
      )}
    </div>
  );
};

export default Tabs;