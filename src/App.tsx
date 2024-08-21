import { useState } from "react";
import { io } from "socket.io-client";
import { Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import Game from "./pages/Game";
import Auth from "./pages/Auth";
import Lobby from "./pages/Lobby";
import Games from "./pages/Games";
import NewGame from "./pages/NewGame";

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
  const [isLoggedIn, setIsLoggedIn] = useState(false);

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
              // <AuthChecker targetUrl="/lobby">
              <Lobby />
              // </AuthChecker>
            }
          />
          <Route
            path="/games"
            element={
              // <AuthChecker targetUrl="/games">
              <Games />
              // </AuthChecker>
            }
          />
          <Route
            path="/game/"
            element={
              // <AuthChecker targetUrl="/game">
              <Game />
              // </AuthChecker>
            }
          />
          <Route
            path="/new-game"
            element={
              // <AuthChecker targetUrl="/game">
              <NewGame />
              // </AuthChecker>
            }
          />
        </Routes>
      </main>
    </>
  );
}

export default App;
