import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import AuthChecker from "./components/AuthChecker";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import Games from "./pages/Games";
import GamePlay from "./pages/GamePlay";
import GameSetup from "./pages/NewGame";
import Lobby from "./pages/Lobby";

const apiUrl: string = import.meta.env.VITE_API_URL;

if (!apiUrl) {
  throw new Error("VITE_API_URL is not defined in the environment variables");
}

const socket = io(apiUrl);

function App() {
  useEffect(() => {
    function onConnect() {
      console.log("Connected!");
    }

    function onDisconnect() {
      console.log("Disconnected!");
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, []);
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
