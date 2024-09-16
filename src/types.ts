export interface Team {
    idTeam: string;
    strTeam: string;
    strTeamBadge: string; //URL
  }
  
  export interface League {
    idLeague: string;
    strLeague: string;
    teams: Team[];
  }

  