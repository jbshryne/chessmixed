import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import socket from "../assets/socket";
import { useFetch } from "../assets/hooks";
import Board from "../components/Board";
import StatusBox from "../components/StatusBox";
import { Game, MoveShort } from "../types";
import { Chess, Move, Color, Square } from "chess.js";
import { Piece as PieceSymbol } from "react-chessboard/dist/chessboard/types";
import { Engine } from "../assets/classes";
import { enemyColor } from "../assets/utils";

const GamePlay = () => {
  const currentUser = JSON.parse(localStorage.getItem("cm-user")!);
  const selectedGame: Game = JSON.parse(localStorage.getItem("cm-game")!);

  const [fetchGameReq, fetchGameRes] = useFetch<Game>();
  const [makeMoveReq, makeMoveRes] = useFetch<Game>();
  const navigate = useNavigate();
  const engine = useRef(new Engine());

  const chessObject = new Chess();
  if (selectedGame.pgn) {
    chessObject.loadPgn(selectedGame.pgn);
  } else {
    chessObject.load(selectedGame.fen);
  }

  // REDIRECT IF NO GAME SELECTED
  useEffect(() => {
    if (!selectedGame) {
      navigate("/games");
    }
  }, [navigate, selectedGame]);

  // 'FETCH GAME' REQUEST
  useEffect(() => {
    fetchGameReq("games/" + game._id, "GET");
    socket.emit("joinRoom", `game-${selectedGame._id}`);
    // eslint-disable-next-line
  }, []);

  // 'FETCH GAME' RESPONSE
  useEffect(() => {
    const { data, loading, error } = fetchGameRes;

    if (data) {
      // console.log("data:", data);
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

  let displayNameWhite = game.playerWhite.displayName;
  let displayNameBlack = game.playerBlack.displayName;
  let povColor: Color =
    currentUser._id === game.playerWhite.playerId ? "w" : "b";

  const isLocalGame = game.playerWhite.playerId === game.playerBlack.playerId;
  const isCpuGame = playerWhiteId === "cpu" || playerBlackId === "cpu";

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

  // IS CHECKMATE?
  useEffect(() => {
    if (chess.isCheckmate()) {
      setPlayerStatus(" is in checkmate!");
    }
  }, [chess]);

  function makeAMove(move: MoveShort) {
    const chessCopy = new Chess();
    let newMove: Move;

    if (move.position) chessCopy.load(move.position);
    else chessCopy.loadPgn(chess.pgn());

    try {
      newMove = chessCopy.move(move);
    } catch (error) {
      console.log(chessCopy.ascii());
      console.log("error:", error);
      return null;
    }

    // ADD PROMOTION LOGIC HERE

    setChess(chessCopy);

    // ADD CAPTURED PIECES TO LIST
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

    // 'MAKE MOVE' REQUEST
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

  // 'MAKE MOVE' RESPONSE
  useEffect(() => {
    const { data, loading, error } = makeMoveRes;

    if (data) {
      // console.log("makeMoveData:", data);
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
      playerId: currentUser._id,
    });

    // illegal move
    if (move === null) return false;

    if (!isLocalGame && !isCpuGame) {
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

    // Evaluate the new position with Stockfish
    if (
      isCpuGame &&
      ((move.color === "b" && playerWhiteId === "cpu") ||
        (move.color === "w" && playerBlackId === "cpu"))
    ) {
      engine.current.stop(); // Ensure the engine is stopped before starting a new evaluation
      engine.current.evaluatePosition(move.after, 3); // Set depth to 15 or any desired depth

      // LISTEN FOR THE EVALUATION RESULT
      engine.current.onMessage(({ bestMove }) => {
        console.log("Stockfish best move:", bestMove);
        if (bestMove) {
          const from = bestMove.slice(0, 2);
          const to = bestMove.slice(2, 4);

          makeAMove({
            from,
            to,
            playerId: "cpu",
            isCpuMove: true,
            position: move.after,
          });
        }
      });
    }

    return true;
  }

  // GET NEW MOVE FROM SERVER
  useEffect(() => {
    socket.on("getNewMove", (move: MoveShort) => {
      console.log("getNewMove received:", move);
      if (move.playerId !== currentUser._id) makeAMove(move);
    });
  });

  // STOCKFISH CLEANUP
  useEffect(() => {
    return () => {
      engine.current.stop();
      engine.current.quit();
    };
  }, []);

  return (
    <div className="page-container">
      <StatusBox isActive={chess.turn() !== povColor}>
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
      <StatusBox isActive={chess.turn() === povColor}>
        {chess.turn() === povColor &&
          (povColor === "w" ? displayNameWhite : displayNameBlack) +
            playerStatus}
      </StatusBox>
    </div>
  );
};

export default GamePlay;
