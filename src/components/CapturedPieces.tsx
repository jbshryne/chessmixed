import { Piece } from "chess.js";

type CapturedPiecesProps = {
  captured: Piece[];
};

const CapturedPieces = ({ captured }: CapturedPiecesProps) => {
  console.log(captured);

  // sort piece list by point value (queen, rook, bishop, knight, pawn)

  const sortedCaptured = captured.sort((a, b) => {
    const pieceValue: { [key: string]: number } = {
      q: 9,
      r: 5,
      n: 3,
      b: 2,
      p: 1,
    };

    return pieceValue[b.type] - pieceValue[a.type];
  });

  const capturedList = sortedCaptured.map((piece, index) => {
    return (
      <div key={index}>
        <img
          src={`images/pieces/${piece.color}${piece.type.toUpperCase()}.svg`}
          alt=""
        />
      </div>
    );
  });

  return <div>{capturedList}</div>;
};

export default CapturedPieces;
