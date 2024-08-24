import { useState, useEffect } from "react";
import { useFetch } from "../assets/hooks";

const ConnectionChecker = () => {
  const [status, setStatus] = useState("");
  // const [hasFetched, setHasFetched] = useState(false);

  const [pokeServerReq, pokeServerRes] = useFetch<{ success: boolean }>();

  const handleTest = async () => {
    // setHasFetched(true);
    await pokeServerReq("hi");
  };

  useEffect(() => {
    // if (!hasFetched) return;

    const { data, loading, error } = pokeServerRes;

    if (loading) {
      setStatus("Checking connection...");
    } else if (error) {
      setStatus("Something went wrong. Please try again later.");
    } else if (data?.success) {
      setStatus("Connected!");
    }
  }, [pokeServerReq, pokeServerRes]);

  return (
    <div>
      <button onClick={handleTest}>Test API Connection</button>
      <p className="status-box">{status}</p>
    </div>
  );
};

export default ConnectionChecker;
