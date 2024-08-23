import { useState } from "react";
// import { useNavigate, Link } from "react-router-dom";
import Board from "../components/Board";
import StatusBox from "../components/StatusBox";
import { Game as GameType } from "../types";

const Game = () => {
  const selectedGame: GameType = JSON.parse(localStorage.getItem("cm-game")!);
  // const navigate = useNavigate();

  const [fetchedGame] = useState<GameType | null>(selectedGame);

  let displayNameWhite = fetchedGame?.playerWhite.displayName;
  let displayNameBlack = fetchedGame?.playerBlack.displayName;

  if (fetchedGame?.playerWhite.playerId === fetchedGame?.playerBlack.playerId) {
    displayNameWhite = "White";
    displayNameBlack = "Black";
  }

  return (
    <div className="page-container">
      <StatusBox>
        {fetchedGame?.povColor === "w" ? displayNameBlack : displayNameWhite}
      </StatusBox>
      <Board game={fetchedGame} />
      <StatusBox>
        {fetchedGame?.povColor === "w" ? displayNameWhite : displayNameBlack}
      </StatusBox>
    </div>
  );
};

export default Game;
