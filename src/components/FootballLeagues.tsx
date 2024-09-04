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

      // Check cache first
      const cachedData = localStorage.getItem(CACHE_KEY);
      if (cachedData) {
        setLeagues(JSON.parse(cachedData));
        setIsLoading(false);
        setInitialLoadDone(true); // Initial load done from cache
        return;
      }

      try {
        const leaguesResponse = await axios.get(
          'https://www.thesportsdb.com/api/v1/json/3/all_leagues.php'
        );
        const allLeagues = leaguesResponse.data.leagues || [];

        const soccerLeagues = await Promise.all(
          allLeagues
            .filter((league: any) => league.strSport === 'Soccer') // Filter for soccer leagues
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

        // Cache the data
        localStorage.setItem(CACHE_KEY, JSON.stringify(validLeagues));
      } catch (error) {
        console.error('Error fetching leagues or teams:', error);
      } finally {
        setIsLoading(false);
        setInitialLoadDone(true); // Initial load done
      }
    };

    fetchLeagues();
  }, []);

  const handleSelectTab = (index: number) => {
    setTabLoading(index); // Set loading for the selected tab
    setSelectedIndex(index);
    setTimeout(() => {
      setTabLoading(null); // Reset loading after a short delay
    }, 500); // Delay to simulate loading time
  };

  const filteredLeagues = leagues.filter((league) =>
    league.strLeague.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="football-leagues">
      <h1>Football Leagues</h1>
      <input
        type="text"
        placeholder="Search by league..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
      />
      {isLoading && !initialLoadDone ? (
        <div className="initial-loader"></div>
      ) : (
        <>
          {filteredLeagues.length === 0 ? (
            <div className="empty-state">No leagues to display</div>
          ) : (
            <Tabs selectedIndex={selectedIndex} onSelect={handleSelectTab}>
              <TabList className="tab-list">
                {filteredLeagues.map((league, index) => (
                  <Tab key={league.idLeague} className={`tab ${selectedIndex === index ? 'tab--selected' : ''}`}>
                    {league.strLeague}
                  </Tab>
                ))}
              </TabList>

              {filteredLeagues.map((league, index) => (
                <TabPanel key={league.idLeague} className="tab-panel">
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
                </TabPanel>
              ))}
            </Tabs>
          )}
        </>
      )}
    </div>
  );
};

export default FootballLeagues;
