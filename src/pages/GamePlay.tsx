import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFetch } from "../assets/hooks";
import Board from "../components/Board";
import StatusBox from "../components/StatusBox";
import { Game, MoveShort } from "../types";
import { Chess, Color, Square } from "chess.js";

const GamePlay = () => {
  const currentUser = JSON.parse(localStorage.getItem("cm-user")!);
  const selectedGame: Game = JSON.parse(localStorage.getItem("cm-game")!);

  const [chess, setChess] = useState<Chess>(new Chess(selectedGame.fen));
  const navigate = useNavigate();

  const [makeMoveReq, makeMoveRes] = useFetch();

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

  function makeAMove(move: MoveShort) {
    const chessCopy = new Chess(chess.fen());
    const result = chessCopy.move(move);
    setChess(chessCopy);
    console.log("pgn:", chessCopy.pgn());

    if (move) {
      makeMoveReq(
        "games/" + selectedGame._id + "/move",
        {
          fen: chessCopy.fen(),
          pgn: chessCopy.pgn(),
          currentTurn: chessCopy.turn(),
        },
        "PUT"
      );
    }

    return result;
  }

  function onDrop(sourceSquare: Square, targetSquare: Square) {
    const move = makeAMove({
      from: sourceSquare,
      to: targetSquare,
      promotion: "q", // always promote to a queen for example simplicity
    });

    // illegal move
    console.log("move:", move);
    if (move === null) return false;

    return true;
  }

  useEffect(() => {
    const { data, loading, error } = makeMoveRes;

    if (data) {
      console.log("data:", data);
      localStorage.setItem("cm-game", JSON.stringify(data));
    }

    if (loading) {
      console.log("loading...");
    }

    if (error) {
      console.log("error:", error);
    }
  }, [makeMoveRes]);

  return (
    <div className="page-container">
      <StatusBox>
        {povColor === "w" ? displayNameBlack : displayNameWhite}
      </StatusBox>
      <Board
        game={selectedGame}
        position={chess.fen()}
        getPositionObject={() => {}}
        povColor={povColor}
        onDrop={onDrop}
      />
      <StatusBox>
        {povColor === "w" ? displayNameWhite : displayNameBlack}
      </StatusBox>
    </div>
  );
};

export default GamePlay;
