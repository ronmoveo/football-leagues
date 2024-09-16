import React from 'react';
import { Team } from '../../types';
import './LeagueTeamsView.scss';

interface LeagueTeamsViewProps {
  teams: Team[] | undefined;
}

const LeagueTeamsView: React.FC<LeagueTeamsViewProps> = ({ teams }) => {
  if (!teams || teams.length === 0) {
    return <div className="teams-container">Loading teams...</div>;
  }

  

  return (
    <div className="teams-container">
      <div className="teams-flex">
        {teams.map((team) => (
          <div key={team.idTeam} className="team-card">
            <img src={team.strTeamBadge} alt={`${team.strTeam} logo`} />
            <h3>{team.strTeam}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LeagueTeamsView;