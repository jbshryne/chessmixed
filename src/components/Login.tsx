import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useFetch } from "../assets/hooks";
import { LoginData } from "../types";

type LoginProps = {
  handleLogin: () => void;
};

const Login = ({ handleLogin }: LoginProps) => {
  const navigate = useNavigate();
  const [loginReq, loginRes] = useFetch<LoginData>();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(formData);

    await loginReq("login", "POST", formData);
  };

  useEffect(() => {
    const { data, loading, error } = loginRes;

    if (data) {
      console.log(data);
      localStorage.setItem("cm-user", JSON.stringify(data.user));
      handleLogin();
      navigate("/games");
    }

    if (loading) {
      console.log("loading...");
    }

    if (error) {
      console.log(error);
    }
  }, [loginReq, loginRes, handleLogin, navigate]);

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="username">
          Username:{" "}
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={(e) =>
              setFormData({ ...formData, username: e.target.value })
            }
          />
        </label>{" "}
        <label htmlFor="password">
          Password:{" "}
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
          />
        </label>{" "}
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
