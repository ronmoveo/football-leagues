import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { League } from '../../types';
import HeaderSearchBar from '../HeaderSearchBar/HeaderSearchBar';
import Tabs from '../Tabs/Tabs';
import './FootballLeagues.scss';

const CACHE_KEY = 'footballLeaguesCache';

const FootballLeagues: React.FC = () => {
  const [leagues, setLeagues] = useState<League[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndex, setSelectedIndex] = useState<number | undefined>(undefined);

  const fetchLeagues = async (): Promise<void> => {
    setIsLoading(true);
    const cachedData = localStorage.getItem(CACHE_KEY);
    if (cachedData) {
      setLeagues(JSON.parse(cachedData));
      setIsLoading(false);
      return;
    }

    try {
      const leaguesResponse = await axios.get('https://www.thesportsdb.com/api/v1/json/3/all_leagues.php');
      const soccerLeagues: League[] = leaguesResponse.data.leagues
        .filter((league: any) => league.strSport === 'Soccer')
        .map((league: any) => ({ idLeague: league.idLeague, strLeague: league.strLeague }));
      setLeagues(soccerLeagues);
      localStorage.setItem(CACHE_KEY, JSON.stringify(soccerLeagues));
    } catch (error) {
      console.error('Error fetching leagues:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLeagues();
  }, []);

  const filteredLeagues = leagues.filter((league) => 
    league.strLeague.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderEmptyState = (message: string) => (
    <div className="empty-state">
      <p>{message}</p>
    </div>
  );

  const renderContent = () => {
    if (isLoading) {
      return <div className="loader"></div>;
    }

    if (filteredLeagues.length === 0) {
      return renderEmptyState("No leagues found matching your search. Please try a different term.");
    }

    return (
      <>
        <Tabs
          leagues={filteredLeagues}
          selectedIndex={selectedIndex}
          setSelectedIndex={setSelectedIndex}
        />
        {selectedIndex === undefined && 
          renderEmptyState("Please select a league to view its details.")}
      </>
    );
  };

  return (
    <div className="football-leagues">
      <HeaderSearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      {renderContent()}
    </div>
  );
};

export default FootballLeagues;