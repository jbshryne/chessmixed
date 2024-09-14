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

  const capturedList = sortedCaptured.reduce(
    (acc: { [key: string]: number }, piece) => {
      const pieceKey = `${piece.color}${piece.type.toUpperCase()}`;
      if (!acc[pieceKey]) {
        acc[pieceKey] = 1;
      } else {
        acc[pieceKey]++;
      }
      return acc;
    },
    {}
  );

  const capturedPieces = Object.entries(capturedList).map(
    ([pieceKey, count]) => {
      return (
        <div key={pieceKey}>
          <img src={`images/pieces/${pieceKey}.svg`} alt="" /> x {count}
        </div>
      );
    }
  );

  return <div className="shaded-container">{capturedPieces}</div>;
};

export default CapturedPieces;
