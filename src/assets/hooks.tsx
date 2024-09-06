import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Game } from "../types";
import { Color } from "chess.js";

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
  // const [savedGame, setSavedGame] = useState<Game | null>(null);
  const navigate = useNavigate();

  const [saveGameReq, saveGameRes] = useFetch<Game>();
  const [deleteGameReq, deleteGameRes] = useFetch<{ success: boolean }>();

  function _selectGame(selectedGame: Game, gameMode: "play" | "edit") {
    localStorage.setItem("cm-game", JSON.stringify(selectedGame));
    if (gameMode === "play") navigate("/game");
    if (gameMode === "edit") navigate("/edit-game");
  }

  function newGame() {
    localStorage.removeItem("cm-game");
    navigate("/new-game");
  }

  function playGame(selectedGame: Game) {
    _selectGame(selectedGame, "play");
  }

  function editGame(selectedGame: Game) {
    _selectGame(selectedGame, "edit");
  }

  let savedGame: Game;

  function saveGame(selectedGame: Game, fen: string, currentTurn: Color) {
    const newFen = fen + " " + currentTurn + " KQkq - 0 1";
    savedGame = { ...selectedGame, fen: newFen, currentTurn };
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
    const confirmation = confirm("Delete this game?");
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

  return { newGame, playGame, editGame, saveGame, deleteGame };
}
