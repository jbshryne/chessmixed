import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigateGames } from "../assets/hooks";
import { convertPositionObjectToFen } from "../assets/utils";
import { Game } from "../types";
import { Color } from "chess.js";
import Board from "../components/Board";

const GameSetup = () => {
  // const currentUser = JSON.parse(localStorage.getItem("cm-user")!);
  const selectedGame: Game = JSON.parse(localStorage.getItem("cm-game")!);

  const [fen, setFen] = useState<string>(selectedGame.fen);
  const [currentTurn, setCurrentTurn] = useState<Color>(
    selectedGame.currentTurn
  );

  const { playGame, saveGame } = useNavigateGames();

  const handleSetFen = (position: Record<string, string>) => {
    const convertedFen = convertPositionObjectToFen(position);
    // console.log("Converted FEN:", convertedFen);
    setFen(convertedFen);
  };

  const handleDiscard = () => {
    const confirmation = confirm("Discard these changes and return to game?");
    if (confirmation) {
      setFen(selectedGame.fen);
      playGame(selectedGame);
    }
  };

  const handleReset = () => {
    const confirmation = confirm("Reset the board to starting position?");
    if (confirmation) {
      setFen("start");
      setCurrentTurn("w");
    }
  };

  const handleSave = () => {
    const confirmation = confirm("Save these changes and continue playing?");
    if (confirmation) {
      saveGame(selectedGame, fen, currentTurn);
    }
  };

  const whiteToMoveInput = (
    <section className="controls">
      <label htmlFor="whiteToMove">
        White to move
        <input
          type="radio"
          id="whiteToMove"
          value="w"
          checked={currentTurn === "w"}
          onChange={() => setCurrentTurn("w")}
        />
      </label>
    </section>
  );

  const blackToMoveInput = (
    <section className="controls">
      <label htmlFor="blackToMove">
        Black to move
        <input
          type="radio"
          id="blackToMove"
          value="b"
          checked={currentTurn === "b"}
          onChange={() => setCurrentTurn("b")}
        />
      </label>
    </section>
  );

  return (
    <div className="page-container">
      {selectedGame.povColor === "b" ? whiteToMoveInput : blackToMoveInput}

      <Board
        getPositionObject={handleSetFen}
        position={fen}
        povColor={selectedGame.povColor}
      />

      {selectedGame.povColor === "b" ? blackToMoveInput : whiteToMoveInput}

      <section className="controls">
        <Link to="/games">
          <button>Back to Games</button>
        </Link>
        <button onClick={handleDiscard}>Discard Changes</button>
        <button onClick={handleReset}>Start Position</button>
        <button onClick={handleSave}>Save and Continue</button>
      </section>
    </div>
  );
};

export default GameSetup;
