import { useEffect, useState } from "react";
import axios from "axios";

const useBookSearch = (query, pageNumber) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [books, setBooks] = useState([]);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    // Reset books when query changes
    setBooks([]);
  }, [query]);

  useEffect(() => {
    setLoading(true);
    setError(false);
    let cancel;

    if (query === "") {
      setLoading(false);
      setBooks([]);
      return;
    }

    axios({
      method: "get",
      url: "https://openlibrary.org/search.json",
      params: { q: query, page: pageNumber },
      cancelToken: new axios.CancelToken((c) => (cancel = c)),
    })
      .then((res) => {
        // Deduplicate books by title while preserving order
        console.log(res);
        const newBooks = res.data.docs
          .filter((book) => book.title) // Ensure title exists
          .map((book) => book.title);

        setBooks((prevBooks) => {
          // Use Set to remove duplicates, but keep previous books
          const combinedBooks = [...prevBooks, ...newBooks];
          return [...new Set(combinedBooks)];
        });

        setHasMore(res.data.docs.length > 0);
        setLoading(false);
      })
      .catch((e) => {
        // Only set error if not a cancellation
        if (!axios.isCancel(e)) {
          setError(true);
          setLoading(false);
        }
      });

    // Cleanup function
    return () => {
      if (cancel) cancel();
    };
  }, [query, pageNumber]);

  return { loading, error, books, hasMore };
};

export default useBookSearch;
