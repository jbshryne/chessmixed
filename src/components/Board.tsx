import { Chessboard } from "react-chessboard";
import "../styles/components/Board.css";
import { Game } from "../types";

type BoardProps = {
  game?: Game | null;
  // setFetchedGame: any;
};

const Board = ({ game }: BoardProps) => {
  // console.log(Chessboard);

  return (
    <>
      <div className="board-container">
        <Chessboard
          position={game?.fen}
          boardOrientation={game?.povColor === "b" ? "black" : "white"}
        />
      </div>
    </>
  );
};

export default Board;
