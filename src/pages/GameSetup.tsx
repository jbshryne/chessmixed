import { useState } from "react";
// import { useFetch } from "../assets/hooks";
import { convertPositionObjectToFen } from "../assets/utils";
import Board from "../components/Board";

const GameSetup = () => {
  const [fen, setFen] = useState<string>("");
  // const [updateGameReq, updateGameRes] = useFetch<{ success: boolean }>();

  const handleSetFen = (position: Record<string, string>) => {
    const convertedFen = convertPositionObjectToFen(position);
    setFen(convertedFen);
    console.log(fen);
  };

  return (
    <div>
      <Board getPositionObject={handleSetFen} />
    </div>
  );
};

export default GameSetup;
