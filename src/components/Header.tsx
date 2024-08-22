import React from "react";
import { Link } from "react-router-dom";
import "../styles/components/Header.css";

type AuthProps = {
  isLoggedIn: boolean;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
};

const Header = ({ isLoggedIn, setIsLoggedIn }: AuthProps) => {
  const handleLogout = () => {
    localStorage.removeItem("cm-user");
    localStorage.removeItem("cm-game");
    setIsLoggedIn(false);
    window.location.reload();
  };

  return (
    <div id="navbar">
      <Link to="/">
        <button>Home</button>
      </Link>
      <Link to="/games">
        <button>My Games</button>
      </Link>
      <Link to="/game">
        <button>Current Game</button>
      </Link>
      <Link to="/lobby">
        <button>Lobby</button>
      </Link>
      {!isLoggedIn ? (
        <Link to="/login">
          <button>Login</button>
        </Link>
      ) : (
        <button onClick={handleLogout}>Logout</button>
      )}
    </div>
  );
};

export default Header;
