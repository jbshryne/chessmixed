import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Board from "../components/Board";
import StatusBox from "../components/StatusBox";
import { Game } from "../types";

const GamePlay = () => {
  const navigate = useNavigate();

  const selectedGame: Game = JSON.parse(localStorage.getItem("cm-game")!);

  useEffect(() => {
    if (!selectedGame) {
      navigate("/games");
    }
  }, [navigate, selectedGame]);

  const [fetchedGame] = useState<Game | null>(selectedGame);

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

export default GamePlay;
