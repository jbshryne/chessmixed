import { Chessboard } from "react-chessboard";
import "../styles/components/Board.css";
import { Game } from "../types";

type BoardProps = {
  fetchedGame: Game | null;
  // setFetchedGame: any;
};

const Board = ({ fetchedGame }: BoardProps) => {
  console.log(Chessboard);

  return (
    <>
      <div className="board-container">
        <Chessboard position={fetchedGame?.fen} />
      </div>
    </>
  );
};

export default Board;
