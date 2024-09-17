import React, { useMemo, useCallback, useState, useEffect } from 'react';
import axios from 'axios';
import { League, Team } from '../../types';
import HeaderSearchBar from '../HeaderSearchBar/HeaderSearchBar';
import Tabs from '../Tabs/Tabs';
import EmptyState from '../../common/EmptyState/EmptyState';
import Loader from '../../common/Loader/Loader';
import './FootballLeagues.scss';

const CACHE_KEY = 'footballLeaguesCache';

const FootballLeagues: React.FC = () => {
  const [leagues, setLeagues] = useState<League[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingTeams, setIsLoadingTeams] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [teamSearchTerm, setTeamSearchTerm] = useState('');

  const [selectedIndex, setSelectedIndex] = useState<number | undefined>(undefined);

  const fetchLeagues = (async (): Promise<void> => {
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
  });
  
  useEffect(() => {
    fetchLeagues();
  }, []);

  useEffect(() => {
    if (selectedIndex !== undefined && leagues[selectedIndex] && leagues[selectedIndex].teams === undefined) {
      fetchTeams(leagues[selectedIndex].strLeague, selectedIndex);
    }
  }, [selectedIndex]);


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
    leagues.filter((league) => league.strLeague.toLowerCase().includes(searchTerm.toLowerCase())),
    [leagues, searchTerm]
  );

  const filteredTeams = useMemo(() => {
    if (selectedIndex === undefined || !leagues[selectedIndex]?.teams) return [];
    return leagues[selectedIndex].teams!.filter((team) =>
      team.strTeam.toLowerCase().includes(teamSearchTerm.toLowerCase())
    );
  }, [leagues, selectedIndex, teamSearchTerm]);

  const renderContent = () => {

    return (
      <>
        <Tabs
          leagues={filteredLeagues}
          selectedIndex={selectedIndex}
          setSelectedIndex={setSelectedIndex}
          isLoadingTeams={isLoadingTeams}
          teams={filteredTeams}
          teamSearchTerm={teamSearchTerm}
          setTeamSearchTerm={setTeamSearchTerm}
        />
        {selectedIndex === undefined && (
          <EmptyState leaguesCount={filteredLeagues.length} selectedIndex={selectedIndex} />
        )}
      </>
    );
  };

  return (
    <div className="football-leagues">
      {filteredLeagues.length === 0 && <EmptyState leaguesCount={filteredLeagues.length} selectedIndex={selectedIndex} />}
      {isLoading && <Loader />}
      <HeaderSearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      {renderContent()}
    </div>
  );
};

export default FootballLeagues;
