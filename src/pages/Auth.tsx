import ConnectionChecker from "../components/ConnectionChecker";

type AuthProps = {
  isLoggedIn: boolean;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
};

const Auth = ({ isLoggedIn, setIsLoggedIn }: AuthProps) => {
  console.log(typeof isLoggedIn, typeof setIsLoggedIn);

  return (
    <div>
      <ConnectionChecker />
    </div>
  );
};

export default Auth;
