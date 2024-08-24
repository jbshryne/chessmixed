import { Chessboard } from "react-chessboard";
import "../styles/components/Board.css";
import { Game } from "../types";

type BoardProps = {
  game?: Game | null;
  size?: "full" | "thumbnail";
};

const Board = ({ game, size = "full" }: BoardProps) => {
  // console.log(Chessboard);

  return (
    <>
      <div className={`board-container ${size === "full" ? "full-board" : ""}`}>
        <Chessboard
          position={game?.fen}
          boardOrientation={game?.povColor === "b" ? "black" : "white"}
        />
      </div>
    </>
  );
};

export default Board;
