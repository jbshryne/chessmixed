import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFetch } from "../assets/hooks";

const Login = () => {
  const navigate = useNavigate();
  const [fetchData, loginData, loading, error] = useFetch();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(formData);

    await fetchData("login", formData);
  };

  useEffect(() => {
    if (loginData) {
      console.log(loginData);
      localStorage.setItem("cm-user", JSON.stringify(loginData.user));
      navigate("/games");
    }

    if (loading) {
      console.log("loading...");
    }

    if (error) {
      console.log(error);
    }
  }, [loginData, loading, error, navigate]);

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="username">
          Username:
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={(e) =>
              setFormData({ ...formData, username: e.target.value })
            }
          />
        </label>
        <label htmlFor="password">
          Password:
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
          />
        </label>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
