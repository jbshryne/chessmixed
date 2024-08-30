import { Color } from "chess.js";

export const convertPositionObjectToFen = (
  position: Record<string, string>
) => {
  let fen = "";
  let emptySquares = 0;

  for (let rank = 8; rank >= 1; rank--) {
    for (let file = 1; file <= 8; file++) {
      const square = String.fromCharCode(96 + file) + rank;

      const piece = position[square];
      let pieceLetter = "";

      if (piece && piece.length >= 2) {
        if (piece[0] === "b") {
          pieceLetter = piece[1].toLowerCase();
        } else if (piece[0] === "w") {
          pieceLetter = piece[1].toUpperCase();
        }

        if (emptySquares > 0) {
          fen += emptySquares;
          emptySquares = 0;
        }
        fen += pieceLetter;
        // fen += piece;
      } else {
        emptySquares++;
      }
    }

    if (emptySquares > 0) {
      fen += emptySquares;
      emptySquares = 0;
    }

    if (rank > 1) {
      fen += "/";
    }
  }

  return fen;
};

export const enemyColor = (color: Color): Color => {
  return color === "w" ? "b" : "w";
};
