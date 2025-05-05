import { useState } from "react";

const useFetch = (method) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = async (url, body = null) => {
    setLoading(true);
    setError(null);

    try {
      const options = {
        method,
        headers: { "Content-Type": "application/json" },
      };

      if (body) options.body = JSON.stringify(body);

      const res = await fetch(url, options);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

      const json = await res.json();
      setData(json);
      return json;
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { execute, data, loading, error };
};

export default useFetch;
