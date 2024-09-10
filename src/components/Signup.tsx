import { useState, useEffect } from "react";
import { useFetch } from "../assets/hooks";

interface SignupData {
  displayName: string;
  username: string;
  password: string;
  passwordConfirm?: string;
}

type SignupProps = {
  handleSignup: () => void;
};

const Signup = ({ handleSignup }: SignupProps) => {
  const [formData, setFormData] = useState<SignupData>({
    displayName: "",
    username: "",
    password: "",
    passwordConfirm: "",
  });

  const [signupRes, signupReq] = useFetch<{ message: string }>();

  const handleFormData = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (formData.password !== formData.passwordConfirm) {
      alert("Passwords do not match");
      return;
    }

    const reqBody = {
      displayName: formData.displayName,
      username: formData.username,
      password: formData.password,
    };

    await signupRes("signup", "POST", reqBody);
  };

  useEffect(() => {
    const { data, loading, error } = signupReq;

    if (data) {
      console.log(data);
      alert(data);
      handleSignup();
    }

    if (loading) {
      console.log("loading...");
    }

    if (error) {
      console.log(error);
    }
  }, [signupReq, handleSignup]);

  return (
    <div>
      {/* <h1>Signup</h1> */}
      <form onSubmit={handleSubmit}>
        <label>
          Display Name:
          <input type="text" name="displayName" onChange={handleFormData} />
        </label>
        <label>
          Username:
          <input type="text" name="username" onChange={handleFormData} />
        </label>
        <label>
          Password:
          <input type="password" name="password" onChange={handleFormData} />
        </label>
        <label>
          Confirm Password:
          <input
            type="password"
            name="passwordConfirm"
            onChange={handleFormData}
          />
        </label>
        <input className="button" type="submit" value="Submit" />
      </form>
    </div>
  );
};

export default Signup;
