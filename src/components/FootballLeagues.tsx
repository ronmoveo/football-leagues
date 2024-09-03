import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import './FootballLeagues.scss';

interface Team {
  idTeam: string;
  strTeam: string;
  strBadge: string;
}

interface League {
  idLeague: string;
  strLeague: string;
  teams: Team[];
}

const LEAGUES = [
  { id: '4328', name: 'English Premier League', country: 'England' },
  { id: '4332', name: 'La Liga', country: 'Spain' },
  { id: '4331', name: 'Bundesliga', country: 'Germany' },
  { id: '4334', name: 'Serie A', country: 'Italy' },
  { id: '4335', name: 'Ligue 1', country: 'France' },
];

const FootballLeagues: React.FC = () => {
  const [leagues, setLeagues] = useState<League[]>([]);

  useEffect(() => {
    const fetchLeagues = async () => {
      const leaguesData = await Promise.all(
        LEAGUES.map(async (league) => {
          const response = await axios.get(
            `https://www.thesportsdb.com/api/v1/json/3/search_all_teams.php?s=Soccer&c=${encodeURIComponent(league.country)}`
          );

          // Log the entire response to inspect the structure
          console.log(`Response for league ${league.name}:`, response.data);

          // Log each team's properties
          response.data.teams.forEach((team: any) => {
            console.log(`Team: ${team.strTeam}, Badge URL: ${team.strBadge}, Team Object:`, team);
          });

          return {
            idLeague: league.id,
            strLeague: league.name,
            teams: response.data.teams || [],
          };
        })
      );
      setLeagues(leaguesData);
    };

    fetchLeagues();
  }, []);

  return (
    <div className="football-leagues">
      <h1>Football Leagues</h1>
      <Tabs>
        <TabList>
          {leagues.map((league) => (
            <Tab key={league.idLeague}>{league.strLeague}</Tab>
          ))}
        </TabList>

        {leagues.map((league) => (
          <TabPanel key={league.idLeague}>
            <div className="teams-grid">
              {league.teams.map((team) => (
                <div key={team.idTeam} className="team-card">
                  <img src={team.strBadge} alt={`${team.strTeam} logo`} />
                  <h3>{team.strTeam}</h3>
                </div>
              ))}
            </div>
          </TabPanel>
        ))}
      </Tabs>
    </div>
  );
};

export default FootballLeagues;
