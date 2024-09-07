import {
  useState,
  useEffect,
  // useRef
} from "react";
import { useNavigate } from "react-router-dom";
import { Game, MoveShort } from "../types";
import { Chess, Color } from "chess.js";
import { confirmChoice } from "./utils";
import { Engine } from "./classes";

export function useFetch<T>(): [
  (
    urlTag: string,
    reqType?: string,
    reqBody?: Record<string, unknown>
  ) => Promise<void>,
  { data: T | null; loading: boolean; error: Error | null }
] {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchReq = async (
    urlTag: string,
    reqType?: string | undefined,
    reqBody?: Record<string, unknown> | undefined
  ) => {
    setLoading(true);
    setError(null);

    const reqObject: RequestInit = {
      method: reqType || (reqBody ? "POST" : "GET"),
      headers: {
        "Content-Type": "application/json",
      },
      body: reqBody ? JSON.stringify(reqBody) : null,
    };

    try {
      const response = await fetch(
        import.meta.env.VITE_API_URL + urlTag,
        reqObject
      );
      if (!response.ok) {
        throw new Error(`Error fetching: ${response.statusText}`);
      }
      const data = await response.json();
      setData(data);
    } catch (error) {
      setError(error as Error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRes = {
    data,
    loading,
    error,
  };

  return [fetchReq, fetchRes];
}

export function useNavigateGames() {
  const navigate = useNavigate();

  const [createGameReq, createGameRes] = useFetch<{
    game: Game;
    success: boolean;
  }>();
  const [saveGameReq, saveGameRes] = useFetch<Game>();
  const [deleteGameReq, deleteGameRes] = useFetch<{ success: boolean }>();

  function _selectGame(selectedGame: Game, gameMode: "play" | "edit") {
    localStorage.setItem("cm-game", JSON.stringify(selectedGame));
    if (gameMode === "play") navigate("/game");
    if (gameMode === "edit") navigate("/edit-game");
  }

  function createGame(gameData: {
    playerWhiteId: string;
    playerBlackId: string;
    fen: string;
    povColor: Color;
    currentTurn: Color;
  }) {
    console.log("Create Game");

    createGameReq("games/create", "POST", gameData);
  }

  useEffect(() => {
    const { data, error, loading } = createGameRes;

    if (data?.success) {
      console.log("Game created:", data.game);
      localStorage.setItem("cm-game", JSON.stringify(data.game));
      navigate("/game");
    }
    if (error) {
      console.error(error);
    }
    if (loading) {
      console.log("Loading...");
    }
  }, [createGameRes, navigate]);

  function playGame(selectedGame: Game) {
    _selectGame(selectedGame, "play");
  }

  function editGame(selectedGame: Game) {
    _selectGame(selectedGame, "edit");
  }

  let savedGame: Game;

  function saveGame(selectedGame: Game, fen: string, currentTurn: Color) {
    const newFen = fen + " " + currentTurn + " KQkq - 0 1";
    savedGame = { ...selectedGame, fen: newFen, pgn: "", currentTurn };
    saveGameReq(`games/${selectedGame._id}`, "PUT", savedGame);
  }

  useEffect(() => {
    const { data, loading, error } = saveGameRes;

    if (data) {
      console.log("Game successfully saved", data);
      playGame(data);
    }
    if (loading) {
      console.log("Saving...");
    }
    if (error) {
      console.error(error);
    }
    // eslint-disable-next-line
  }, [saveGameRes]);

  function deleteGame(gameId: string) {
    const confirmation = confirmChoice("Delete this game?");
    if (confirmation) deleteGameReq(`games/delete`, "DELETE", { gameId });
  }

  useEffect(() => {
    const { data, loading, error } = deleteGameRes;

    if (data?.success) {
      location.reload();
    }
    if (loading) {
      console.log("Deleting...");
    }
    if (error) {
      console.error(error);
    }
  }, [deleteGameRes]);

  return { createGame, playGame, editGame, saveGame, deleteGame };
}

export function useCpuPlayer() {
  const engine = new Engine();

  const cpuMove = (
    chess: Chess,
    game: Game,
    makeAMove: (move: MoveShort) => void
  ) => {
    console.log(game.difficulty);
    const fen = chess.fen();

    engine.stop(); // Ensure the engine is stopped before starting a new evaluation
    engine.evaluatePosition(chess.fen(), 3); // Set depth to 15 or any desired depth

    // LISTEN FOR THE EVALUATION RESULT
    engine.onMessage(({ bestMove }) => {
      console.log("Stockfish best move:", bestMove);
      if (bestMove) {
        const from = bestMove.slice(0, 2);
        const to = bestMove.slice(2, 4);
        const promotion = bestMove.slice(4, 5) as
          | "q"
          | "r"
          | "b"
          | "n"
          | undefined;

        console.log("chess.pgn() in stockfish onMessage \n", fen);
        console.log("game.pgn in stockfish onMessage \n", game.fen);

        makeAMove({
          from,
          to,
          promotion,
          pgn: chess.pgn(),
          playerId: "cpu",
          isCpuMove: true,
        });
      }
    });
  };

  // STOCKFISH CLEANUP
  useEffect(() => {
    return () => {
      engine.stop();
      engine.quit();
    };
    // eslint-disable-next-line
  }, []);

  return cpuMove;
}
