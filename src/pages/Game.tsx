import Board from "../components/Board";
import StatusBox from "../components/StatusBox";

const Game = () => {
  return (
    <div className="page-container">
      <StatusBox>Black</StatusBox>
      <div className="board-container">
        <Board />
      </div>
      <StatusBox>White</StatusBox>
    </div>
  );
};

export default Game;
