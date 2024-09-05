import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useFetch } from "../assets/hooks";
import { Game, User } from "../types";
import { Chessboard } from "react-chessboard";
import "../styles/pages/Games.css";

const Games = () => {
  const [allGames, setAllGames] = useState<Game[]>([]);
  const navigate = useNavigate();

  const [fetchGamesReq, fetchGamesRes] = useFetch<Game[]>();
  const [deleteGameReq, deleteGameRes] = useFetch<{
    success: boolean;
  }>();

  const currentUser: User = JSON.parse(localStorage.getItem("cm-user")!);

  useEffect(() => {
    fetchGamesReq("games", "POST", { userId: currentUser._id });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const { data, loading, error } = fetchGamesRes;

    if (data) {
      setAllGames(data);
    }
    if (loading) {
      console.log("Loading...");
    }
    if (error) {
      console.error(error);
    }
  }, [fetchGamesRes]);

  function handleNewGame() {
    localStorage.removeItem("cm-game");
    console.log("New Game");
    navigate("/new-game");
  }

  function handleGameSelection(
    selectedGame: Game,
    gameMode: "play" | "edit" = "play"
  ) {
    console.log(selectedGame);
    localStorage.setItem("cm-game", JSON.stringify(selectedGame));
    if (gameMode === "play") navigate("/game");
    if (gameMode === "edit") navigate("/edit-game");
  }

  function handleDeleteGame(gameId: string) {
    console.log("Delete Game", gameId);
    deleteGameReq(`games/delete`, "DELETE", { gameId });
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

  return (
    <div className="page-container">
      <h1>{currentUser.displayName}'s Games</h1>
      <button onClick={() => handleNewGame()}>Create New Game</button>
      <ul id="games-container">
        {allGames.map((game: Game) => {
          const opponentName =
            game.playerWhite.playerId === game.playerBlack.playerId
              ? "none"
              : game.playerWhite.playerId === currentUser._id
              ? game.playerBlack.displayName
              : game.playerWhite.displayName;

          return (
            <li key={game._id} className="thumbnail-container">
              <h3>Opponent: {opponentName}</h3>

              <div
                className="board-container game-thumbnail"
                onClick={() => handleGameSelection(game)}
              >
                <Chessboard
                  // key={game._id}
                  id={game._id}
                  position={game.fen}
                  arePiecesDraggable={false}
                  boardOrientation={game.povColor === "b" ? "black" : "white"}
                />
              </div>

              <section className="controls">
                <button onClick={() => handleGameSelection(game)}>Play</button>
                <button onClick={() => handleGameSelection(game, "edit")}>
                  Edit
                </button>
                <button onClick={() => handleDeleteGame(game._id)}>
                  Delete
                </button>
              </section>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Games;
