import { Chessboard } from "react-chessboard";
import "../styles/components/Board.css";

const Board = () => {
  console.log(Chessboard);

  return (
    <>
      <div className="board-container">
        <Chessboard />
      </div>
    </>
  );
};

export default Board;
