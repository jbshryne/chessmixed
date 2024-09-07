import {
  useState,
  useEffect,
  // useRef
} from "react";
import { Link, useNavigate } from "react-router-dom";
import socket from "../assets/socket";
import { useFetch, useNavigateGames, useCpuPlayer } from "../assets/hooks";
import { Game, MoveShort } from "../types";
import { Chess, Move, Color, Square } from "chess.js";
import { Piece as PieceSymbol } from "react-chessboard/dist/chessboard/types";
// import { Engine } from "../assets/classes";
import { enemyColor } from "../assets/utils";
import Board from "../components/Board";
import StatusBox from "../components/StatusBox";

const GamePlay = () => {
  const currentUser = JSON.parse(localStorage.getItem("cm-user")!);
  const selectedGame: Game = JSON.parse(localStorage.getItem("cm-game")!);

  // const engine = useRef(new Engine());
  const navigate = useNavigate();

  const [fetchGameReq, fetchGameRes] = useFetch<Game>();
  const [makeMoveReq, makeMoveRes] = useFetch<Game>();

  const { editGame } = useNavigateGames();

  const cpuMove = useCpuPlayer();

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
    if (loading) console.log("Fetching game...");
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

  // const makeAMove = useCallback(
  //   (move: MoveShort): [Move, Chess] | [] => {
  function makeAMove(move: MoveShort): [Move, Chess] | [] {
    const newChess = new Chess();
    let newMove: Move;

    if (move.pgn) newChess.loadPgn(move.pgn);
    else newChess.loadPgn(chess.pgn());

    // if (newChess.pgn() !== game.pgn) return [];

    try {
      newMove = newChess.move(move);
    } catch (error) {
      console.log("error:", newChess.pgn());
      console.log("error:", error);
      return [];
    }

    // ADD PROMOTION LOGIC HERE

    setChess(newChess);

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
    if (newChess.inCheck()) setPlayerStatus(" is in check!");
    else setPlayerStatus(" to move");

    // checkmate
    if (newChess.isCheckmate()) {
      setPlayerStatus(" is in checkmate!");
      // return;
    }

    // 'MAKE MOVE' REQUEST
    if (move) {
      makeMoveReq("games/" + game._id + "/move", "PUT", {
        fen: newChess.fen(),
        pgn: newChess.pgn(),
        currentTurn: newChess.turn(),
        captured: newCaptured,
        isCpuMove: move.isCpuMove,
        validMoves: newChess.moves(),
      });
    }

    return [newMove, newChess];
  }
  //   },
  //   [chess, game, makeMoveReq]
  // );

  // 'MAKE MOVE' RESPONSE

  useEffect(() => {
    // console.log("makeMoveRes effect runs", makeMoveRes);
    // console.log("chess.pgn():", chess.pgn());
    // console.log("game.pgn:", game.pgn);
    // console.log("data.pgn:", makeMoveRes.data?.pgn);
    const { data, loading, error } = makeMoveRes;

    if (data) {
      if (data.pgn === chess.pgn()) {
        console.log("Move has been made \n", data.pgn);
        localStorage.setItem("cm-game", JSON.stringify(data));
        setGame(data);
        if (loading) console.log("Sending new move...");
        if (error) console.log("error:", error);
      }
    }
    // eslint-disable-next-line
  }, [makeMoveRes]);

  function onDrop(sourceSquare: Square, targetSquare: Square) {
    const [newMove] = makeAMove({
      from: sourceSquare,
      to: targetSquare,
      promotion: "q", // CHANGE THIS TO USER INPUT
      playerId: currentUser._id,
    });

    // illegal move
    if (newMove === null) return false;

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

    return true;
  }

  useEffect(() => {
    if (
      isCpuGame &&
      ((chess.turn() === "w" && playerWhiteId === "cpu") ||
        (chess.turn() === "b" && playerBlackId === "cpu"))
    ) {
      console.log("chess.pgn() in cpuMove effect \n", chess.pgn());
      setTimeout(() => {
        cpuMove(chess, game, makeAMove);

        // engine.current.stop(); // Ensure the engine is stopped before starting a new evaluation
        // engine.current.evaluatePosition(chess.fen(), 3); // Set depth to 15 or any desired depth

        // // LISTEN FOR THE EVALUATION RESULT
        // engine.current.onMessage(({ bestMove }) => {
        //   console.log("Stockfish best move:", bestMove);
        //   if (bestMove) {
        //     const from = bestMove.slice(0, 2);
        //     const to = bestMove.slice(2, 4);
        //     const promotion = bestMove.slice(4, 5) as
        //       | "q"
        //       | "r"
        //       | "b"
        //       | "n"
        //       | undefined;

        //     makeAMove({
        //       from,
        //       to,
        //       promotion,
        //       pgn: chess.pgn(),
        //       playerId: "cpu",
        //       isCpuMove: true,
        //     });
        //   }
        // });
      }, 1500);
    }
    // eslint-disable-next-line
  }, [chess]);

  // GET NEW MOVE FROM SERVER
  useEffect(() => {
    socket.on("getNewMove", (move: MoveShort) => {
      console.log("getNewMove received:", move);
      if (move.playerId !== currentUser._id) makeAMove(move);
    });
  });

  // // STOCKFISH CLEANUP
  // useEffect(() => {
  //   return () => {
  //     engine.current.stop();
  //     // eslint-disable-next-line react-hooks/exhaustive-deps
  //     engine.current.quit();
  //   };
  // }, []);

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

      <section className="controls">
        <Link to="/games">
          <button>Back to Games</button>
        </Link>
        <button onClick={() => editGame(game)}>Edit Boardstate</button>
      </section>
    </div>
  );
};

export default GamePlay;
