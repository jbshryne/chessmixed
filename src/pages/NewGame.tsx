import { useState, useEffect } from "react";
import { useFetch, useNavigateGames } from "../assets/hooks";
import { convertPositionObjectToFen } from "../assets/utils";
import { User, Player } from "../types";
import { Color } from "chess.js";
import Board from "../components/Board";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";

const NewGame = () => {
  const currentUser: User = JSON.parse(localStorage.getItem("cm-user")!);

  const [playerWhiteId, setPlayerWhiteId] = useState<string>(currentUser._id);
  const [playerBlackId, setPlayerBlackId] = useState<string>(currentUser._id);
  const [friends, setFriends] = useState<Record<string, string>[]>([]);
  const [selectedOpponent, setSelectedOpponent] = useState<{
    value: string;
    label: string;
  }>({ value: currentUser._id, label: "Yourself" });
  const [povColor, setPovColor] = useState<Color>("w");
  const [fen, setFen] = useState<string>("");
  const [currentTurn, setCurrentTurn] = useState<Color>("w");
  // const [difficulty, setDifficulty] = useState<number>(1);

  // const selectedGame: Game = JSON.parse(localStorage.getItem("cm-game")!);
  // if (!selectedGame) {
  //   navigate("/games");
  // }

  const [fetchFriendsReq, fetchFriendsRes] = useFetch<Player[]>();
  const { createGame } = useNavigateGames();

  const handleSetFen = (position: Record<string, string>) => {
    const newFen = convertPositionObjectToFen(position);
    setFen(newFen);
  };

  const handleSelectOpponent = (value: string) => {
    const selectedFriend = friendsList.find((friend) => friend.value === value);
    setSelectedOpponent(selectedFriend!);

    if (povColor === "w") {
      setPlayerBlackId(selectedFriend!.value);
    } else {
      setPlayerWhiteId(selectedFriend!.value);
    }
  };

  const handleSetPovColor = (color: Color) => {
    setPovColor(color);

    if (color === "w") {
      setPlayerWhiteId(currentUser._id);
      setPlayerBlackId(selectedOpponent.value);
    } else {
      setPlayerWhiteId(selectedOpponent.value);
      setPlayerBlackId(currentUser._id);
    }
  };

  // POPULATE FRIENDS LIST (REQUEST)
  useEffect(() => {
    fetchFriendsReq("friends/" + currentUser._id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // POPULATE FRIENDS LIST (RESPONSE)
  useEffect(() => {
    const { data, loading, error } = fetchFriendsRes;

    if (data) {
      setFriends(data);
    }
    if (loading) {
      console.log("Loading...");
    }
    if (error) {
      console.error(error);
    }
  }, [fetchFriendsRes]);

  const friendsList: { value: string; label: string }[] = [
    {
      value: currentUser._id,
      label: "Yourself",
    },
    {
      value: "cpu",
      label: "Computer",
    },
  ];
  for (let i = 0; i < friends.length; i++) {
    friendsList.push({
      value: friends[i]._id,
      label: friends[i].displayName,
    });
  }

  const handleCreateGame = () => {
    const newGame = {
      playerWhiteId,
      playerBlackId,
      fen: fen,
      currentTurn: currentTurn,
      povColor: povColor,
    };

    createGame(newGame);
  };

  return (
    <div className="page-container">
      <h1>New Game</h1>
      <section>
        <span>Which is your color?</span>

        <input
          type="radio"
          id="white"
          name="color"
          value="w"
          checked={povColor === "w"}
          onChange={() => handleSetPovColor("w")}
        />
        <label htmlFor="white">White</label>

        <input
          type="radio"
          id="black"
          name="color"
          value="b"
          checked={povColor === "b"}
          onChange={() => handleSetPovColor("b")}
        />
        <label htmlFor="black">Black</label>
      </section>
      <section>
        <span>Who is your opponent?</span>
        <Dropdown
          options={friendsList}
          value={selectedOpponent}
          onChange={(option) => handleSelectOpponent(option.value)}
        />
      </section>
      <section>
        <span>Whose turn is it?</span>
        <input
          type="radio"
          id="white"
          name="turn"
          value="w"
          checked={currentTurn === "w"}
          onChange={() => setCurrentTurn("w")}
        />
        <label htmlFor="white">White</label>
        <input
          type="radio"
          id="black"
          name="turn"
          value="b"
          checked={currentTurn === "b"}
          onChange={() => setCurrentTurn("b")}
        />
        <label htmlFor="black">Black</label>
      </section>
      <section>
        <span>What is the starting position?</span>
        {/* <div></div> */}
        <Board getPositionObject={handleSetFen} povColor={povColor} />
      </section>
      <button onClick={() => handleCreateGame()}>Create Game</button>
    </div>
  );
};

export default NewGame;
