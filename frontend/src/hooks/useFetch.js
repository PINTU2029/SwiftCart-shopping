import { useState, useEffect } from 'react';
import API from '../api/axios';

export const useFetch = (url) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await API.get(url);
        setData(res.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    if (url) fetchData();
  }, [url]);

  return { data, loading, error };
};