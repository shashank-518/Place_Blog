import { useState, useCallback, useRef, useEffect } from "react";

export const useHttp = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();

  const activeHttpRequests = useRef([]);

  const sendRequest = useCallback(async (url, method = "GET", body = null, headers = {}) => {
    setLoading(true);
    const httpAbortCtrl = new AbortController();
    activeHttpRequests.current.push(httpAbortCtrl);

    try {
      const response = await fetch(url, {
        method,
        body,
        headers: headers && typeof headers === "object" ? headers : {}, // ✅ ensures object
        signal: httpAbortCtrl.signal,
      });

      const responseData = await response.json();

      activeHttpRequests.current = activeHttpRequests.current.filter(
        reqCtrl => reqCtrl !== httpAbortCtrl
      );

      if (!response.ok) {
        throw new Error(responseData.message);
      }

      setLoading(false);
      return responseData;
    } catch (err) {
      setError(err.message || "Something went wrong!");
      setLoading(false);
      throw err;
    }
  }, []);

  const clearError = () => setError(null);

  useEffect(() => {
    return () => {
      activeHttpRequests.current.forEach(abortCtrl => abortCtrl.abort());
    };
  }, []);

  return { loading, error, sendRequest, clearError };
};
