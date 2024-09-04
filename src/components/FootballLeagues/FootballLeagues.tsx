import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { League } from '../../types';
import HeaderSearchBar from '../HeaderSearchBar/HeaderSearchBar';
import './FootballLeagues.scss';

const CACHE_KEY = 'footballLeaguesCache';

const FootballLeagues: React.FC = () => {
  const [leagues, setLeagues] = useState<League[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndex, setSelectedIndex] = useState<number | undefined>(undefined);
  const [tabLoading, setTabLoading] = useState<number | null>(null); 
  const [initialLoadDone, setInitialLoadDone] = useState(false); 

  useEffect(() => {
    const fetchLeagues = async () => {
      setIsLoading(true);

      const cachedData = localStorage.getItem(CACHE_KEY);
      if (cachedData) {
        setLeagues(JSON.parse(cachedData));
        setIsLoading(false);
        setInitialLoadDone(true); 
        return;
      }

      try {
        const leaguesResponse = await axios.get(
          'https://www.thesportsdb.com/api/v1/json/3/all_leagues.php'
        );
        const allLeagues = leaguesResponse.data.leagues || [];

        const soccerLeagues = await Promise.all(
          allLeagues
            .filter((league: any) => league.strSport === 'Soccer')
            .map(async (league: any) => {
              if (!league.strLeague) return null;
              const response = await axios.get(
                `https://www.thesportsdb.com/api/v1/json/3/search_all_teams.php?l=${encodeURIComponent(league.strLeague)}`
              );
              return {
                idLeague: league.idLeague,
                strLeague: league.strLeague,
                teams: response.data.teams || [],
              };
            })
        );

        const validLeagues = soccerLeagues.filter((league) => league !== null) as League[];
        setLeagues(validLeagues);

        localStorage.setItem(CACHE_KEY, JSON.stringify(validLeagues));
      } catch (error) {
        console.error('Error fetching leagues or teams:', error);
      } finally {
        setIsLoading(false);
        setInitialLoadDone(true);
      }
    };

    fetchLeagues();
  }, []);

  const handleSelectTab = (index: number) => {
    setTabLoading(index); 
    setSelectedIndex(index);
    setTimeout(() => {
      setTabLoading(null);
    }, 500);
  };

  const filteredLeagues = leagues.filter((league) =>
    league.strLeague.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="football-leagues">
      <HeaderSearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      {isLoading && !initialLoadDone ? (
        <div className="initial-loader"></div>
      ) : (
        <>
          {filteredLeagues.length === 0 ? (
            <div className="empty-state">No leagues to display</div>
          ) : (
            <div className="tabs-container">
              <div className="tab-list">
                {filteredLeagues.map((league, index) => (
                  <div
                    key={league.idLeague}
                    className={`tab ${selectedIndex === index ? 'tab--selected' : ''}`}
                    onClick={() => handleSelectTab(index)}
                  >
                    {league.strLeague}
                  </div>
                ))}
              </div>

              {filteredLeagues.map((league, index) => (
                <div key={league.idLeague} className={`tab-panel ${selectedIndex === index ? 'tab-panel--selected' : ''}`}>
                  {tabLoading === index ? (
                    <div className="loader"></div>
                  ) : (
                    selectedIndex === index && (
                      <div className="teams-grid">
                        {league.teams.map((team) => (
                          <div key={team.idTeam} className="team-card">
                            <img src={team.strBadge} alt={`${team.strTeam} logo`} />
                            <h3>{team.strTeam}</h3>
                          </div>
                        ))}
                      </div>
                    )
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default FootballLeagues;
