import React from 'react';
import { Team } from '../../types';
import './TeamsData.scss';

interface TeamsDataProps {
  teams: Team[];
}

const TeamsData: React.FC<TeamsDataProps> = ({ teams }) => {
  return (
    <div className="teams-grid">
      {teams.map((team) => (
        <div key={team.idTeam} className="team-card">
          <img src={team.strBadge} alt={`${team.strTeam} logo`} />
          <h3>{team.strTeam}</h3>
        </div>
      ))}
    </div>
  );
};

export default TeamsData;
