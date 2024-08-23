import { useState } from "react";
import { io } from "socket.io-client";
import { Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import AuthChecker from "./components/AuthChecker";
import Games from "./pages/Games";
import GamePlay from "./pages/GamePlay";
import GameSetup from "./pages/GameSetup";
import Lobby from "./pages/Lobby";

const apiUrl: string = import.meta.env.VITE_API_URL;

if (!apiUrl) {
  throw new Error("VITE_API_URL is not defined in the environment variables");
}

const socket = io(apiUrl);

// Example of setting up event listeners
socket.on("connect", () => {
  console.log("Connected to the server");
});

socket.on("disconnect", () => {
  console.log("Disconnected from the server");
});

function App() {
  const currentUser = JSON.parse(localStorage.getItem("cm-user")!);

  const [isLoggedIn, setIsLoggedIn] = useState(currentUser ? true : false);

  return (
    <>
      <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/login"
            element={
              <Auth isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
            }
          />
          <Route
            path="/lobby"
            element={
              <AuthChecker>
                <Lobby />
              </AuthChecker>
            }
          />
          <Route
            path="/games"
            element={
              <AuthChecker>
                <Games />
              </AuthChecker>
            }
          />
          <Route
            path="/game/"
            element={
              <AuthChecker>
                <GamePlay />
              </AuthChecker>
            }
          />
          <Route
            path="/new-game"
            element={
              <AuthChecker>
                <GameSetup />
              </AuthChecker>
            }
          />
        </Routes>
      </main>
    </>
  );
}

export default App;
