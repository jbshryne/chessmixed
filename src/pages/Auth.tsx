import ConnectionChecker from "../components/ConnectionChecker";
import Login from "../components/Login";

type AuthProps = {
  isLoggedIn: boolean;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
};

const Auth = ({ isLoggedIn, setIsLoggedIn }: AuthProps) => {
  console.log(typeof isLoggedIn, typeof setIsLoggedIn);

  return (
    <div>
      <ConnectionChecker />
      <Login />
    </div>
  );
};

export default Auth;
