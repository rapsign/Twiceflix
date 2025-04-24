import { useEffect, useRef } from "react";

const useDebouncedSearch = (query, callback, delay = 300) => {
  const timeout = useRef();

  useEffect(() => {
    clearTimeout(timeout.current);
    if (query !== undefined) {
      timeout.current = setTimeout(() => {
        callback(query);
      }, delay);
    }

    return () => clearTimeout(timeout.current);
  }, [query, callback, delay]);
};

export default useDebouncedSearch;
