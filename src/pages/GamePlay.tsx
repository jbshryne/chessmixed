import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Board from "../components/Board";
import StatusBox from "../components/StatusBox";
import { Game } from "../types";
import { Color } from "chess.js";

const GamePlay = () => {
  const navigate = useNavigate();

  const currentUser = JSON.parse(localStorage.getItem("cm-user")!);
  const selectedGame: Game = JSON.parse(localStorage.getItem("cm-game")!);

  useEffect(() => {
    if (!selectedGame) {
      navigate("/games");
    }
  }, [navigate, selectedGame]);

  let displayNameWhite = selectedGame?.playerWhite.displayName;
  let displayNameBlack = selectedGame?.playerBlack.displayName;
  let povColor: Color =
    currentUser._id === selectedGame?.playerWhite.playerId ? "w" : "b";

  if (
    selectedGame?.playerWhite.playerId === selectedGame?.playerBlack.playerId
  ) {
    displayNameWhite = "White";
    displayNameBlack = "Black";
    povColor = selectedGame?.povColor;
  }

  return (
    <div className="page-container">
      <StatusBox>
        {povColor === "w" ? displayNameBlack : displayNameWhite}
      </StatusBox>
      <Board
        game={selectedGame}
        getPositionObject={() => {}}
        povColor={povColor}
      />
      <StatusBox>
        {povColor === "w" ? displayNameWhite : displayNameBlack}
      </StatusBox>
    </div>
  );
};

export default GamePlay;
