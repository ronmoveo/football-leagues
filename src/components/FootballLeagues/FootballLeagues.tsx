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

  useEffect(() => {
    const fetchLeagues = async () => {
      setIsLoading(true);
      const cachedData = localStorage.getItem(CACHE_KEY);
      if (cachedData) {
        setLeagues(JSON.parse(cachedData));
        setIsLoading(false);
        return;
      }

      try {
        const leaguesResponse = await axios.get('https://www.thesportsdb.com/api/v1/json/3/all_leagues.php');
        const soccerLeagues = leaguesResponse.data.leagues
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
    fetchLeagues();
  }, []);

  const filteredLeagues = leagues.filter((league) => league.strLeague.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="football-leagues">
      <HeaderSearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      {isLoading ? (
        <div className="loader"></div>
      ) : (
        <Tabs
          leagues={filteredLeagues}
          selectedIndex={selectedIndex}
          setSelectedIndex={setSelectedIndex}
        />
      )}
    </div>
  );
};

export default FootballLeagues;
