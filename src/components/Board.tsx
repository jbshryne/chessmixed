import { Chessboard } from "react-chessboard";
import "../styles/components/Board.css";
import { Game, User } from "../types";
import { Color } from "chess.js";
import { BoardOrientation } from "react-chessboard/dist/chessboard/types";

type BoardProps = {
  game?: Game | null;
  size?: "full" | "thumbnail";
  povColor?: Color;
  getPositionObject: (position: Record<string, string>) => void;
};

const Board = ({
  game,
  size = "full",
  povColor,
  getPositionObject,
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
          position={game?.fen}
          boardOrientation={boardOrientation}
          getPositionObject={(position) => getPositionObject(position)}
        />
      </div>
    </>
  );
};

export default Board;
