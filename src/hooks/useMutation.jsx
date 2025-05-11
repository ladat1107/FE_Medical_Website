import { useState } from "react";

export const useMutation = (promise) => {
  const [data, setData] = useState();
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);

  const execute = async (payload, { onSuccess, onFail } = {}) => {
    setLoading(true);
    try {
      const res = await promise(payload);

      if (res) {
        setData(res);
        onSuccess?.(res); // sent data to outside
      }
    } catch (error) {
      setError(error);
      onFail?.(error);
    } finally {
      setLoading(false);
    }
  };

  return {
    execute,
    data,
    loading,
    error,
  };
};
