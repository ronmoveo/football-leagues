export interface Team {
    idTeam: string;
    strTeam: string;
    strBadge: string; //URL
  }
  
  export interface League {
    idLeague: string;
    strLeague: string;
    teams: Team[];
  }

  export interface HeaderSearchBarProps {
    searchTerm: string;
    setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  }

  export interface EmptyStateProps {
    leaguesCount: number;
    selectedIndex: number | undefined;
  }

  export interface LeagueTeamsViewProps {
    teams: Team[] | undefined;
  }

  export interface TabsProps {
    leagues: League[];
    selectedIndex: number | undefined;
    setSelectedIndex: (index: number) => void;
    isLoadingTeams: boolean;
    teams: Team[];
    teamSearchTerm: string;
    setTeamSearchTerm: (term: string) => void;
  }