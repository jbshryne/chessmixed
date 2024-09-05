import { Color, Piece, PieceSymbol } from "chess.js"

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
  povColor: Color;
  currentTurn: Color;
  captured: Piece[];
};

export type MoveShort = {
  from: string;
  to: string;
  promotion?: PieceSymbol
  position?: string;
  playerId?: string
  isCpuMove?: boolean
}

type LoginData = {
  success: boolean;
  user: User;
};

export type AuthProps = {
  isLoggedIn: boolean;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
};