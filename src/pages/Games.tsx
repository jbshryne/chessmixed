import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useFetch, useNavigateGames } from "../assets/hooks";
import { Game, User } from "../types";
import { Chessboard } from "react-chessboard";
import "../styles/pages/Games.css";
import { BoardOrientation } from "react-chessboard/dist/chessboard/types";

const Games = () => {
  const currentUser: User = JSON.parse(localStorage.getItem("cm-user")!);
  const [allGames, setAllGames] = useState<Game[]>([]);

  const navigate = useNavigate();

  const [fetchGamesReq, fetchGamesRes] = useFetch<Game[]>();
  const { playGame, editGame, deleteGame } = useNavigateGames();

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

  function newGame() {
    localStorage.removeItem("cm-game");
    navigate("/new-game");
  }

  return (
    <div className="page-container">
      <h1>{currentUser.displayName}'s Games</h1>
      <button onClick={() => newGame()}>Create New Game</button>
      <ul id="games-container">
        {allGames.map((game: Game) => {
          const opponentName =
            game.playerWhite.playerId === game.playerBlack.playerId
              ? "none"
              : game.playerWhite.playerId === currentUser._id
              ? game.playerBlack.displayName
              : game.playerWhite.displayName;

          let boardOrientation: BoardOrientation;
          if (game.playerWhite.playerId !== game.playerBlack.playerId) {
            boardOrientation =
              game.playerWhite.playerId === currentUser._id ? "white" : "black";
          } else {
            boardOrientation = game.povColor === "b" ? "black" : "white";
          }

          return (
            <li key={game._id} className="thumbnail-container">
              <h3>Opponent: {opponentName}</h3>

              <div
                className="board-container game-thumbnail"
                onClick={() => playGame(game)}
              >
                <Chessboard
                  // key={game._id}
                  id={game._id}
                  position={game.fen}
                  arePiecesDraggable={false}
                  boardOrientation={boardOrientation}
                />
              </div>

              <section className="controls">
                <button onClick={() => playGame(game)}>Play</button>
                <button onClick={() => editGame(game)}>Edit</button>
                <button onClick={() => deleteGame(game._id)}>Delete</button>
              </section>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Games;
