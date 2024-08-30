import { Chessboard } from "react-chessboard";
import "../styles/components/Board.css";
import { Game, User } from "../types";
import { Color, Square } from "chess.js";
import { BoardOrientation } from "react-chessboard/dist/chessboard/types";

type BoardProps = {
  game?: Game | null;
  position?: string;
  onDrop?: (sourceSquare: Square, targetSquare: Square) => boolean;
  size?: "full" | "thumbnail";
  povColor?: Color;
  // position?: Record<string, string>;
  getPositionObject: (position: Record<string, string>) => void;
};

const Board = ({
  game,
  position,
  size = "full",
  povColor,
  getPositionObject,
  onDrop,
}: BoardProps) => {
  // console.log(Chessboard);

  const currentUser: User = JSON.parse(localStorage.getItem("cm-user")!);
  let boardOrientation: BoardOrientation;

  if (povColor && game?.playerWhite.playerId === game?.playerBlack.playerId) {
    boardOrientation = povColor === "b" ? "black" : "white";
  } else {
    boardOrientation =
      game?.playerWhite.playerId === currentUser._id ? "white" : "black";
  }

  return (
    <>
      <div className={`board-container ${size === "full" ? "full-board" : ""}`}>
        <Chessboard
          position={position}
          boardOrientation={boardOrientation}
          getPositionObject={(position) => getPositionObject(position)}
          onPieceDrop={onDrop}
        />
      </div>
    </>
  );
};

export default Board;
