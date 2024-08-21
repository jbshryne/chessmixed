export type User = {
    _id: string;
    username: string;
    displayName: string;
    friends: string[];
    games: string[];
  }

export type Player = {
    playerId: string;
    username: string;
    displayName: string;
  };
  
  export type Game = {
    _id: string;
    playerWhite: Player;
    playerBlack: Player;
    fen: string;
    pgn: string;
    currentTurn: string;
    capturedWhite: [];
    capturedBlack: [];
  };