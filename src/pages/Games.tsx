import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useFetch } from "../assets/hooks";
import { Game, User } from "../types";
import { Chessboard } from "react-chessboard";
import "../styles/pages/Games.css";

const Games = () => {
  const [allGames, setAllGames] = useState<Game[]>([]);
  const [fetchData, gamesData, loading, error] = useFetch<Game[]>();
  const navigate = useNavigate();

  const currentUser = JSON.parse(localStorage.getItem("cm-user")!) as User;

  useEffect(() => {
    fetchData("games", { userId: currentUser._id });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (gamesData) {
      setAllGames(gamesData);
    }
  }, [gamesData]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  function handleGameSelection(selectedGame: Game) {
    console.log(selectedGame);
    localStorage.setItem("cm-game", JSON.stringify(selectedGame));
    navigate("/game");
  }

  return (
    <div className="page-container">
      <h1>{currentUser.displayName}'s Games</h1>
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
                  key={game._id}
                  position={game.fen}
                  arePiecesDraggable={false}
                  // boardOrientation={game.orientation}
                />
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Games;
