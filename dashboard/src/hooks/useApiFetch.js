import { useState, useCallback, useEffect } from 'react';

export const useApiFetch = (apiFunction, immediate = true, dependencies = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState(null);

  const execute = useCallback(async (...args) => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiFunction(...args);
      setData(result);
      return result;
    } catch (err) {
      setError(err.message || 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiFunction]);

  useEffect(() => {
    let isMounted = true;
    
    if (immediate) {
      setLoading(true);
      apiFunction()
        .then(res => {
          if (isMounted) {
            setData(res);
            setLoading(false);
          }
        })
        .catch(err => {
          if (isMounted) {
            setError(err.message || 'An error occurred');
            setLoading(false);
          }
        });
    }

    return () => {
      isMounted = false;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);

  return { data, loading, error, execute, setData };
};
