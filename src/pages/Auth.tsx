import React from "react";

type AuthProps = {
  isLoggedIn: boolean;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
};

const Auth = ({ isLoggedIn, setIsLoggedIn }: AuthProps) => {
  console.log(isLoggedIn, setIsLoggedIn);

  return <div>Auth</div>;
};

export default Auth;
