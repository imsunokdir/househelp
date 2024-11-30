import React, { useState, useRef, useCallback } from "react";
import axios from "axios";
import useBookSearch from "./useBookSearch";

const Test3 = () => {
  const [query, setQuery] = useState("");
  const [pageNumber, setPageNumber] = useState(1);

  const { books, hasMore, loading, error } = useBookSearch(query, pageNumber);

  const observer = useRef();
  const lastBookElementRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          console.log("Visisble");
          setPageNumber((prevPageNumber) => prevPageNumber + 1);
        }
      });
      if (node) observer.current.observe(node);
      // console.log("node:", node);
    },
    [loading, hasMore]
  );

  const handleSearch = (e) => {
    setQuery(e.target.value);
    setPageNumber(1);
  };

  return (
    <div className="p-3">
      <input
        type="text"
        value={query}
        className="border"
        onChange={handleSearch}
      />
      <div className="grid gap-4 grid-cols-1 md:grid-cols-3 sm:grid-cols-2 mx-auto">
        {books.map((book, index) => {
          if (books.length === index + 1) {
            return (
              <div ref={lastBookElementRef} key={book} className="bg-red-200">
                {book}
              </div>
            );
          } else {
            return <div key={book}>{book}</div>;
          }
        })}
      </div>
      <div>{loading && "Loading..."}</div>
      <div>{error && "Error"}</div>
    </div>
  );
};

export default Test3;
