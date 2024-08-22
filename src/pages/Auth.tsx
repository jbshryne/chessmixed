import ConnectionChecker from "../components/ConnectionChecker";
import Login from "../components/Login";
import { AuthProps } from "../types";

const Auth = ({ isLoggedIn, setIsLoggedIn }: AuthProps) => {
  console.log(typeof isLoggedIn, typeof setIsLoggedIn);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  return (
    <div>
      <ConnectionChecker />
      <Login handleLogin={handleLogin} />
    </div>
  );
};

export default Auth;
