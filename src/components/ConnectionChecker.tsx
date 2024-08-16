import { useState, useEffect } from "react";
import { useFetch } from "../assets/hooks";

const ConnectionChecker = () => {
  const [status, setStatus] = useState("");
  const [hasFetched, setHasFetched] = useState(false);

  const [fetchData, data, loading, error] = useFetch<{ success: boolean }>();

  const handleTest = async () => {
    setHasFetched(true);
    await fetchData(`${import.meta.env.VITE_API_URL}/hi`);
  };

  useEffect(() => {
    if (!hasFetched) return;

    if (loading) {
      setStatus("Checking connection...");
    } else if (error) {
      setStatus("Something went wrong. Please try again later.");
    } else if (data?.success) {
      setStatus("Connected!");
    }
  }, [loading, error, data, hasFetched]);

  return (
    <div>
      <button onClick={handleTest}>Test API Connection</button>
      <p className="status-box">{status}</p>
    </div>
  );
};

export default ConnectionChecker;
