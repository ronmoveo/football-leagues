import React from 'react';
import './LeagueTeamsView.scss';
import {LeagueTeamsViewProps} from '../../types';

const LeagueTeamsView: React.FC<LeagueTeamsViewProps> = ({ teams }) => {
  console.log("🚀 ~ teams:", teams)
  console.log("ron");
  
  if (!teams || teams.length === 0) {
    return <div className="teams-container">Loading teams...</div>;
  }

  return (
    <div className="teams-container">
      <div className="teams-flex">
        {teams.map((team) => (
          <div key={team.idTeam} className="team-card">
            <img src={team.strBadge} alt={`${team.strTeam} logo`} />
            <h3>{team.strTeam}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LeagueTeamsView;