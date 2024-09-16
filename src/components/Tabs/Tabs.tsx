import React from 'react';
import { League } from '../../types';
import TeamsData from '../TeamsData/TeamsData';
import './Tabs.scss';

interface TabsProps {
  leagues: League[];
  selectedIndex: number | undefined; // index of the current selected league or undefiend if none selected
  setSelectedIndex: React.Dispatch<React.SetStateAction<number | undefined>>; // func to update selected index
}

const Tabs: React.FC<TabsProps> = ({ leagues, selectedIndex, setSelectedIndex }) => {
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
        <TeamsData teams={leagues[selectedIndex].teams} /> //renders the teams of the selected leauge (if selected and exists)
      )}
    </div>
  );
};

export default Tabs;
