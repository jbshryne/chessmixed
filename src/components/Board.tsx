import { Chessboard } from "react-chessboard";
import "../styles/components/Board.css";
import { Game, User } from "../types";
import { Color, Square } from "chess.js";
import {
  BoardOrientation,
  Piece as PieceSymbol,
} from "react-chessboard/dist/chessboard/types";

type BoardProps = {
  game?: Game;
  position?: string;
  getPositionObject: (position: Record<string, string>) => void;
  isDraggablePiece: (piece: PieceSymbol, square?: Square) => boolean;
  onDrop?: (sourceSquare: Square, targetSquare: Square) => boolean;
  size?: "full" | "thumbnail";
  povColor?: Color;
  // position?: Record<string, string>;
};

const Board = ({
  game,
  position,
  getPositionObject,
  isDraggablePiece,
  onDrop,
  size = "full",
  povColor,
}: BoardProps) => {
  const currentUser: User = JSON.parse(localStorage.getItem("cm-user")!);
  const playerWhiteId = game?.playerWhite.playerId;
  const playerBlackId = game?.playerBlack.playerId;
  let boardOrientation: BoardOrientation;

  if (povColor && playerWhiteId === playerBlackId) {
    boardOrientation = povColor === "b" ? "black" : "white";
  } else {
    boardOrientation = playerWhiteId === currentUser._id ? "white" : "black";
  }

  return (
    <>
      <div className={`board-container ${size === "full" ? "full-board" : ""}`}>
        <Chessboard
          position={position}
          isDraggablePiece={(args) => isDraggablePiece(args.piece)}
          boardOrientation={boardOrientation}
          getPositionObject={(position) => getPositionObject(position)}
          onPieceDrop={onDrop}
        />
      </div>
    </>
  );
};

export default Board;
