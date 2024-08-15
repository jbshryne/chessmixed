import { Chessboard } from "react-chessboard";

const Board = () => {
  console.log(Chessboard);

  // function onDrop(fromSquare: string, toSquare: string, piece: string) {
  //   console.log("Piece dropped", fromSquare, toSquare, piece)
  //   return true
  // }

  return (
    <>
      <Chessboard
      // boardWidth={480}
      // position="start"
      // customBoardStyle={{
      //   width: 480,
      // }}
      // onPieceDrop={onDrop}
      />
    </>
  );
};

export default Board;
