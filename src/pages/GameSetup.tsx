import Board from "../components/Board";
import { useNavigate } from "react-router-dom";
import { useFetch } from "../assets/hooks";
import { Game, User } from "../types";
import { useEffect } from "react";

const NewGame = () => {
  const navigate = useNavigate();

  const [createGameReq, createGameRes] = useFetch<{
    game: Game;
    success: boolean;
  }>();

  const currentUser: User = JSON.parse(localStorage.getItem("cm-user")!);

  function createGame() {
    console.log("Create Game");
    createGameReq("games/create", {
      playerWhiteId: currentUser._id,
      playerBlackId: currentUser._id,
      currentTurn: "w",
      fen: "start",
    });
  }

  useEffect(() => {
    const { data, error, loading } = createGameRes;

    if (data) {
      console.log(data);
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

  return (
    <div className="page-container">
      <Board />
      <button onClick={() => createGame()}>Create Game</button>
    </div>
  );
};

export default NewGame;
