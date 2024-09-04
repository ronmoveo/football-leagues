export interface Team {
    idTeam: string;
    strTeam: string;
    strBadge: string;
  }
  
  export interface League {
    idLeague: string;
    strLeague: string;
    teams: Team[];
  }