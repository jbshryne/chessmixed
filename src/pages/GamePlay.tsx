import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFetch } from "../assets/hooks";
import Board from "../components/Board";
import StatusBox from "../components/StatusBox";
import { Game, MoveShort } from "../types";
import { Chess, Color, Square } from "chess.js";
import { enemyColor } from "../assets/utils";

const GamePlay = () => {
  const currentUser = JSON.parse(localStorage.getItem("cm-user")!);
  const selectedGame: Game = JSON.parse(localStorage.getItem("cm-game")!);
  const chessObject = new Chess();
  if (selectedGame.pgn) {
    chessObject.loadPgn(selectedGame.pgn);
  } else {
    chessObject.load(selectedGame.fen);
  }

  const [chess, setChess] = useState<Chess>(chessObject);
  const navigate = useNavigate();

  const [makeMoveReq, makeMoveRes] = useFetch<Game>();

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
    const chessCopy = new Chess();
    chessCopy.loadPgn(chess.pgn());

    const result = chessCopy.move(move);
    setChess(chessCopy);
    // console.log("pgn:", chessCopy.pgn());

    const currentGame = JSON.parse(localStorage.getItem("cm-game")!);
    const newCaptured = [...currentGame.captured];
    console.log("newCaptured:", newCaptured);

    if (result.captured) {
      console.log("captured:", result.captured);
      newCaptured.push({
        color: enemyColor(result.color),
        type: result.captured,
      });
      // localStorage.setItem(
      //   "cm-game",
      //   JSON.stringify({ ...selectedGame, captured: newCaptured })
      // );
    }

    if (move) {
      makeMoveReq(
        "games/" + selectedGame._id + "/move",
        {
          fen: chessCopy.fen(),
          pgn: chessCopy.pgn(),
          currentTurn: chessCopy.turn(),
          captured: newCaptured,
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
      promotion: "q", // CHANGE THIS TO USER INPUT
    });

    // illegal move
    // console.log("move:", move);
    if (move === null) return false;

    // localStorage.setItem("cm-game", JSON.stringify(selectedGame));

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
