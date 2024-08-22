import { useState } from "react";
// import { useNavigate, Link } from "react-router-dom";
import Board from "../components/Board";
import StatusBox from "../components/StatusBox";
import { Game as GameType } from "../types";

const Game = () => {
  const selectedGame: GameType = JSON.parse(localStorage.getItem("cm-game")!);
  // const navigate = useNavigate();

  const [fetchedGame] = useState<GameType | null>(selectedGame);

  return (
    <div className="page-container">
      <StatusBox>Black</StatusBox>
      <Board fetchedGame={fetchedGame} />
      <StatusBox>White</StatusBox>
    </div>
  );
};

export default Game;
