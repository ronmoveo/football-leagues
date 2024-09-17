import React, { useMemo, useCallback, useState, useEffect } from 'react';
import axios from 'axios';
import { League, Team } from '../../types';
import HeaderSearchBar from '../HeaderSearchBar/HeaderSearchBar';
import Tabs from '../Tabs/Tabs';
import EmptyState from '../EmptyState/EmptyState';
import Loader from '../Loader/Loader';
import './FootballLeagues.scss';

const CACHE_KEY = 'footballLeaguesCache';

const FootballLeagues: React.FC = () => {
  const [leagues, setLeagues] = useState<League[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingTeams, setIsLoadingTeams] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndex, setSelectedIndex] = useState<number | undefined>(undefined);

  const fetchLeagues = useCallback(async (): Promise<void> => {
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
        .map((league: any) => ({
          idLeague: league.idLeague,
          strLeague: league.strLeague,
          teams: undefined,
        }));
      setLeagues(soccerLeagues);
      localStorage.setItem(CACHE_KEY, JSON.stringify(soccerLeagues));
    } catch (error) {
      console.error('Error fetching leagues:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  useEffect(() => {
    fetchLeagues();
  }, [fetchLeagues]);

  useEffect(() => {
    if (selectedIndex !== undefined && leagues[selectedIndex] && leagues[selectedIndex].teams === undefined) {
      fetchTeams(leagues[selectedIndex].strLeague, selectedIndex);
    }
  }, [selectedIndex, leagues]);


  const fetchTeams = async (leagueName: string, leagueIndex: number) => {
    setIsLoadingTeams(true);
    try {
      const response = await axios.get(
        `https://www.thesportsdb.com/api/v1/json/3/search_all_teams.php?l=${encodeURIComponent(leagueName)}`
      );
      const LeagueTeamsView: Team[] = response.data.teams.map((team: any) => ({
        idTeam: team.idTeam,
        strTeam: team.strTeam,
        strBadge: team.strBadge,
      }));

      setLeagues((prevLeagues) => {
        const updatedLeagues = [...prevLeagues];
        updatedLeagues[leagueIndex] = { ...updatedLeagues[leagueIndex], teams: LeagueTeamsView };
        return updatedLeagues;
      });
    } catch (error) {
      console.error('Error fetching teams:', error);
    } finally {
      setIsLoadingTeams(false);
    }
  };

  const filteredLeagues = useMemo(() => 
    leagues.filter((league) =>
      league.strLeague.toLowerCase().includes(searchTerm.toLowerCase())
    ),
    [leagues, searchTerm]
  );

  const renderContent = () => {
    if (isLoading) {
      return <Loader />;
    }

    if (filteredLeagues.length === 0) {
      return <EmptyState leaguesCount={filteredLeagues.length} selectedIndex={selectedIndex} />;
    }

    return (
      <>
        <Tabs
          leagues={filteredLeagues}
          selectedIndex={selectedIndex}
          setSelectedIndex={setSelectedIndex}
          isLoadingTeams={isLoadingTeams}
        />
        {selectedIndex === undefined && (
          <EmptyState leaguesCount={filteredLeagues.length} selectedIndex={selectedIndex} />
        )}
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
