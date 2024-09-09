import { useState, useEffect } from "react";
import { useFetch, useNavigateGames } from "../assets/hooks";
import { convertPositionObjectToFen } from "../assets/utils";
import { User, Player } from "../types";
import { Color } from "chess.js";
import Board from "../components/Board";
import Dropdown, { Option } from "react-dropdown";
import "react-dropdown/style.css";

const NewGame = () => {
  const currentUser: User = JSON.parse(localStorage.getItem("cm-user")!);

  const [playerWhiteId, setPlayerWhiteId] = useState<string>(currentUser._id);
  const [playerBlackId, setPlayerBlackId] = useState<string>(currentUser._id);
  const [opponentType, setOpponentType] = useState<string>("you");
  const [difficulty, setDifficulty] = useState<Option | undefined>();
  const [friends, setFriends] = useState<Record<string, string>[]>([]);
  const [selectedOpponenet, setSelectedOpponenet] = useState<
    Option | undefined
  >();
  const [povColor, setPovColor] = useState<Color>("w");
  const [fen, setFen] = useState<string>("");
  const [currentTurn, setCurrentTurn] = useState<Color>("w");

  const [fetchFriendsReq, fetchFriendsRes] = useFetch<Player[]>();

  const { createGame } = useNavigateGames();

  const handleSetFen = (position: Record<string, string>) => {
    const newFen = convertPositionObjectToFen(position);
    setFen(newFen);
  };

  const handleSetOpponentType = (value: string) => {
    if (value === "you") {
      setOpponentType("you");
      setDifficulty(undefined);
      setSelectedOpponenet({ value: currentUser._id, label: "Yourself" });

      setPlayerWhiteId(currentUser._id);
      setPlayerBlackId(currentUser._id);
    } else if (value === "cpu") {
      setOpponentType("cpu");
      setDifficulty(undefined);
      setSelectedOpponenet({ value: "cpu", label: "Computer" });

      if (povColor === "w") {
        setPlayerWhiteId(currentUser._id);
        setPlayerBlackId("cpu");
      } else {
        setPlayerWhiteId("cpu");
        setPlayerBlackId(currentUser._id);
      }
    } else if (value === "friend") {
      setOpponentType("friend");
      setDifficulty(undefined);
      setSelectedOpponenet(undefined);

      if (povColor === "w") {
        setPlayerWhiteId(currentUser._id);
        setPlayerBlackId("");
      } else {
        setPlayerWhiteId("");
        setPlayerBlackId(currentUser._id);
      }
    }
  };

  const handleSelectFriend = (value: string) => {
    const selectedFriend = friendsList.find((friend) => friend.value === value);
    setSelectedOpponenet(selectedFriend);

    if (povColor === "w" && selectedFriend) {
      setPlayerBlackId(selectedFriend.value);
    } else if (povColor === "b" && selectedFriend) {
      setPlayerWhiteId(selectedFriend.value);
    }
  };

  const handleSetPovColor = (color: Color) => {
    setPovColor(color);

    if (color === "w") {
      setPlayerWhiteId(currentUser._id);
      setPlayerBlackId(selectedOpponenet!.value);
    } else {
      setPlayerWhiteId(selectedOpponenet!.value);
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

  const difficultyOptions = [
    { value: "1", label: "Casual" },
    { value: "2", label: "Competitive" },
    { value: "3", label: "Grandmaster" },
  ];

  const friendsList: { value: string; label: string }[] = [];
  for (let i = 0; i < friends.length; i++) {
    friendsList.push({
      value: friends[i]._id,
      label: friends[i].displayName,
    });
  }

  const handleCreateGame = () => {
    if (opponentType === "cpu" && !difficulty) {
      alert("Please select a difficulty level.");
      return;
    }

    if (opponentType === "friend" && !selectedOpponenet) {
      alert("Please select a friend.");
      return;
    }

    const newGame = {
      playerWhiteId,
      playerBlackId,
      povColor: povColor,
      fen: fen,
      currentTurn: currentTurn,
      difficulty: Number(difficulty?.value),
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

        <input
          type="radio"
          name="opponent"
          id="you"
          value="you"
          checked={opponentType === "you"}
          onChange={() => handleSetOpponentType("you")}
        />
        <label htmlFor="you">Yourself</label>

        <input
          type="radio"
          name="opponent"
          id="cpu"
          value="cpu"
          checked={opponentType === "cpu"}
          onChange={() => handleSetOpponentType("cpu")}
        />
        <label htmlFor="cpu">Computer</label>

        <input
          type="radio"
          name="opponent"
          id="friend"
          value="friend"
          checked={opponentType === "friend"}
          onChange={() => handleSetOpponentType("friend")}
        />
        <label htmlFor="friend">Friend</label>

        <div>
          {opponentType === "cpu" && (
            <Dropdown
              options={difficultyOptions}
              // value={difficulty}
              onChange={(option) => setDifficulty(option)}
              placeholder={"Select difficulty:"}
            />
          )}

          {opponentType === "friend" && (
            <Dropdown
              options={friendsList}
              // value={selectedOpponenet}
              onChange={(option) => handleSelectFriend(option.value)}
              placeholder={"Select friend:"}
            />
          )}
        </div>
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
