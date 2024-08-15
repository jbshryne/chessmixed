import GameplayBoard from "../components/GameplayBoard";
import StatusBox from "../components/StatusBox";

const Game = () => {
  return (
    <div className="page-container">
      <StatusBox>Black</StatusBox>
      <div className="board-container">
        <GameplayBoard />
      </div>
      <StatusBox>White</StatusBox>
    </div>
  );
};

export default Game;
