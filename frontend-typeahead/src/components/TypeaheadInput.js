import React, { useState, useEffect, useRef } from "react";
import SuggestionsList from "./SuggestionsList";

const MOVIES_ENDPOINT =
  "https://api.themoviedb.org/3/search/movie?api_key=a0471c3efcac73e624b948daeda6085f";
const REQUEST_DELAY = 250;

export default function TypeaheadInput() {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef(null);
  const requestTimeout = useRef(null);

  useEffect(() => {
    return () => {
      clearTimeout(requestTimeout.current);
    };
  }, []);

  const handleInputChange = (e) => {
    const newSearchTerm = e.target.value;
    setSearchTerm(newSearchTerm);
    setShowSuggestions(false);
    clearTimeout(requestTimeout.current);

    if (newSearchTerm.length > 0) {
      requestTimeout.current = setTimeout(() => {
        fetchMovies(newSearchTerm);
      }, REQUEST_DELAY);
    }
  };

  const fetchMovies = (query) => {
    const url = `${MOVIES_ENDPOINT}&query=${encodeURIComponent(query)}`;
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        const results = data.results || [];
        setSuggestions(results.map((movie) => ({ id: movie.id, title: movie.title })));
        setShowSuggestions(true);
      })
      .catch((error) => {
        console.error("Error fetching movies:", error);
        setSuggestions([]);
        setShowSuggestions(false);
      });
  };

  const handleInputBlur = () => {
    setShowSuggestions(false);
  };

  const handleSuggestionHover = () => {
    inputRef.current.blur();
  };

  return (
    <div className="flex flex-col justify-center items-center">
      <input
        ref={inputRef}
        className="text-lg text-primary border-primary border rounded-md w-48 focus:w-96 transition-all focus:outline-none p-1 mb-2"
        placeholder="Search"
        type="text"
        value={searchTerm}
        onChange={handleInputChange}
        onBlur={handleInputBlur}
      />
      {showSuggestions && (
        <SuggestionsList
          suggestions={suggestions}
          onMouseEnter={handleSuggestionHover}
        />
      )}
    </div>
  );
}

