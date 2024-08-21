// import { useState, useEffect } from "react";
// import { useNavigate, Link } from "react-router-dom";
import Board from "../components/Board";
import StatusBox from "../components/StatusBox";
// import { Game as GameType } from "../types";

const Game = () => {
  // const navigate = useNavigate();

  // const [fetchedGame, setFetchedGame] = useState<GameType | null>(null);

  return (
    <div className="page-container">
      <StatusBox>Black</StatusBox>
      <Board />
      <StatusBox>White</StatusBox>
    </div>
  );
};

export default Game;
