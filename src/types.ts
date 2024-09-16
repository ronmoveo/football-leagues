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