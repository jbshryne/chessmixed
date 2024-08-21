import { useState } from "react";

export function useFetch<T>(): [
  (urlTag: string, reqBody?: Record<string, unknown>) => Promise<void>,
  T | null,
  boolean,
  Error | null
] {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = async (
    urlTag: string,
    reqBody: Record<string, unknown> | undefined
  ) => {
    setLoading(true);
    setError(null);

    const reqObject: RequestInit = {
      method: reqBody ? "POST" : "GET",
      headers: {
        "Content-Type": "application/json",
      },
      body: reqBody ? JSON.stringify(reqBody) : null,
    };

    try {
      const response = await fetch(
        import.meta.env.VITE_API_URL + urlTag,
        reqObject
      );
      if (!response.ok) {
        throw new Error(`Error fetching: ${response.statusText}`);
      }
      const data = await response.json();
      setData(data);
    } catch (error) {
      setError(error as Error);
    } finally {
      setLoading(false);
    }
  };

  return [fetchData, data, loading, error];
}
