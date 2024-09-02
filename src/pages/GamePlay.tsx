import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import socket from "../assets/socket";
import { useFetch } from "../assets/hooks";
import Board from "../components/Board";
import StatusBox from "../components/StatusBox";
import { Game, MoveShort } from "../types";
import { Chess, Move, Color, Square } from "chess.js";
import { Piece as PieceSymbol } from "react-chessboard/dist/chessboard/types";
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
  const [fetchGameReq, fetchGameRes] = useFetch<Game>();
  const [makeMoveReq, makeMoveRes] = useFetch<Game>();
  const navigate = useNavigate();

  useEffect(() => {
    if (!selectedGame) {
      navigate("/games");
    }
  }, [navigate, selectedGame]);

  useEffect(() => {
    fetchGameReq("games/" + game._id, "GET");
    socket.emit("joinRoom", `game-${selectedGame._id}`);
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    const { data, loading, error } = fetchGameRes;

    if (data) {
      console.log("data:", data);
      // localStorage.setItem("cm-game", JSON.stringify(data));
      setGame(data);
    }
    if (loading) console.log("loading...");
    if (error) console.log("error:", error);
  }, [fetchGameRes]);

  const [game, setGame] = useState<Game>(selectedGame);
  const [chess, setChess] = useState<Chess>(chessObject);
  const [playerStatus, setPlayerStatus] = useState<string>(" to move");

  const playerWhiteId = game.playerWhite.playerId;
  const playerBlackId = game.playerBlack.playerId;

  // useEffect(() => {
  //   fetchGameReq("games/" + game._id, undefined, "GET");
  //   // eslint-disable-next-line
  // }, []);

  // useEffect(() => {
  //   const { data, loading, error } = fetchGameRes;

  //   if (data) {
  //     console.log("data:", data);
  //     // localStorage.setItem("cm-game", JSON.stringify(data));
  //     setGame(data);
  //   }
  //   if (loading) console.log("loading...");
  //   if (error) console.log("error:", error);
  // }, [fetchGameRes]);

  let displayNameWhite = game.playerWhite.displayName;
  let displayNameBlack = game.playerBlack.displayName;
  let povColor: Color =
    currentUser._id === game.playerWhite.playerId ? "w" : "b";
  const isLocalGame = game.playerWhite.playerId === game.playerBlack.playerId;

  if (isLocalGame) {
    displayNameWhite = "White";
    displayNameBlack = "Black";
    povColor = game.povColor;
  }

  const isDraggablePiece = (piece: PieceSymbol) => {
    const pieceColor = piece[0];

    if (chess.isCheckmate()) return false;

    if (playerWhiteId === playerBlackId) {
      // one-player game
      return (
        (chess.turn() === "w" && pieceColor === "w") ||
        (chess.turn() === "b" && pieceColor === "b")
      );
    } else {
      // console.log("game:", game);
      return (
        (playerWhiteId === currentUser._id &&
          chess.turn() === "w" &&
          pieceColor === "w") ||
        (playerBlackId === currentUser._id &&
          chess.turn() === "b" &&
          pieceColor === "b")
      );
    }
  };

  useEffect(() => {
    if (chess.isCheckmate()) {
      setPlayerStatus(" is in checkmate!");
    }
  }, [chess]);

  function makeAMove(move: MoveShort) {
    const chessCopy = new Chess();
    chessCopy.loadPgn(chess.pgn());
    let newMove: Move;

    try {
      newMove = chessCopy.move(move);
    } catch (error) {
      console.log("error:", error);
      return null;
    }

    // ADD PROMOTION LOGIC HERE

    setChess(chessCopy);

    const newCaptured = [...game.captured];

    if (newMove.captured) {
      console.log("captured:", newMove.captured);
      newCaptured.push({
        color: enemyColor(newMove.color),
        type: newMove.captured,
      });
    }

    // check
    if (chessCopy.inCheck()) setPlayerStatus(" is in check!");
    else setPlayerStatus(" to move");

    // checkmate
    if (chessCopy.isCheckmate()) {
      setPlayerStatus(" is in checkmate!");
      // return;
    }

    if (move) {
      makeMoveReq("games/" + game._id + "/move", "PUT", {
        fen: chessCopy.fen(),
        pgn: chessCopy.pgn(),
        currentTurn: chessCopy.turn(),
        captured: newCaptured,
      });
    }

    return newMove;
  }

  useEffect(() => {
    const { data, loading, error } = makeMoveRes;

    if (data) {
      console.log("data:", data);
      localStorage.setItem("cm-game", JSON.stringify(data));
      setGame(data);
    }
    if (loading) console.log("loading...");
    if (error) console.log("error:", error);
  }, [makeMoveRes]);

  function onDrop(sourceSquare: Square, targetSquare: Square) {
    const move = makeAMove({
      from: sourceSquare,
      to: targetSquare,
      promotion: "q", // CHANGE THIS TO USER INPUT
    });

    // illegal move
    if (move === null) return false;

    if (!isLocalGame) {
      console.log("sending move to server...");

      socket.emit(
        "sendNewMove",
        {
          from: sourceSquare,
          to: targetSquare,
          promotion: "q",
          playerId: currentUser._id,
        },
        `game-${game._id}`
      );
    }

    return true;
  }

  useEffect(() => {
    socket.on("getNewMove", (move: MoveShort) => {
      console.log("getNewMove received:", move);
      if (move.playerId !== currentUser._id) makeAMove(move);
    });
  });

  return (
    <div className="page-container">
      <StatusBox>
        {chess.turn() !== povColor &&
          (povColor === "w" ? displayNameBlack : displayNameWhite) +
            playerStatus}
      </StatusBox>
      <Board
        game={game}
        position={chess.fen()}
        getPositionObject={() => {}}
        isDraggablePiece={isDraggablePiece}
        onDrop={onDrop}
        povColor={povColor}
      />
      <StatusBox>
        {chess.turn() === povColor &&
          (povColor === "w" ? displayNameWhite : displayNameBlack) +
            playerStatus}
      </StatusBox>
    </div>
  );
};

export default GamePlay;
