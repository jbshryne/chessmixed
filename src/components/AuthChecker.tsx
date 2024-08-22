import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

type AuthCheckerProps = {
  children: React.ReactNode;
};

const AuthChecker = ({ children }: AuthCheckerProps) => {
  const navigate = useNavigate();

  const currentUser = JSON.parse(localStorage.getItem("cm-user")!);

  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
    }
  }, [currentUser, navigate]);

  return <div>{currentUser && children}</div>;
};

export default AuthChecker;
