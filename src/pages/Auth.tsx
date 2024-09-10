import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthProps } from "../types";
import Login from "../components/Login";
import ConnectionChecker from "../components/ConnectionChecker";
import Signup from "../components/Signup";

const Auth = ({ isLoggedIn, setIsLoggedIn }: AuthProps) => {
  const [authMode, setAuthMode] = useState<string>("login");

  const navigate = useNavigate();

  if (isLoggedIn) {
    navigate("/games");
  }

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleSignup = () => {
    setAuthMode("login");
  };

  return (
    <div>
      <ConnectionChecker />
      {!isLoggedIn && authMode === "login" && (
        <>
          <Login handleLogin={handleLogin} />
          <button onClick={() => setAuthMode("signup")}>Sign Up</button>
        </>
      )}
      {!isLoggedIn && authMode === "signup" && (
        <>
          <Signup handleSignup={handleSignup} />
        </>
      )}
    </div>
  );
};

export default Auth;
