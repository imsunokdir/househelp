import { useEffect, useRef, useState } from "react";
import { searchServices } from "../services/search";

const useSearch = (keyword, location, debounceMs = 400) => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const debounceRef = useRef(null);

  useEffect(() => {
    if (!keyword || keyword.trim().length < 2) {
      setResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      try {
        const res = await searchServices({
          keyword: keyword.trim(),
          longitude: location?.coordinates?.[0],
          latitude: location?.coordinates?.[1],
          limit: 5, // Only 5 for dropdown
        });
        setResults(res.data.data || []);
        setError(null);
      } catch (err) {
        setError("Search failed");
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, debounceMs);

    return () => clearTimeout(debounceRef.current);
  }, [keyword, location]);

  return { results, loading, error };
};

export default useSearch;
