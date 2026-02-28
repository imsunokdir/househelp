import React, { useContext, useRef, useState, useEffect } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, MapPin, Loader } from "lucide-react";
import { AuthContext } from "../../contexts/AuthProvider";
import useSearch from "../../hooks/useSearch";
import { useLocale } from "antd/es/locale";

const SearchBar = () => {
  const [searchParams] = useSearchParams();
  const [keyword, setKeyword] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);
  const containerRef = useRef(null);
  const navigate = useNavigate();
  const { userLocation } = useContext(AuthContext);
  const location = useLocation();
  const isOnSearchPage = location.pathname === "/search";

  const { results, loading } = useSearch(keyword, userLocation);

  const showDropdown = isFocused && keyword.trim().length >= 2;

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const q = searchParams.get("q");
    if (q) setKeyword(q);
  }, [searchParams]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && keyword.trim().length >= 2) {
      const currentQ = searchParams.get("q");
      const newQ = keyword.trim();

      if (currentQ === newQ) {
        setIsFocused(false);
        return;
      }

      navigate(`/search?q=${encodeURIComponent(newQ)}`);
      setIsFocused(false);
    }
    if (e.key === "Escape") {
      setIsFocused(false);
      inputRef.current?.blur();
    }
  };

  const handleResultClick = (serviceId) => {
    setIsFocused(false);
    setKeyword("");
    navigate(`/show-service-details/${serviceId}`);
  };

  const handleSeeAll = () => {
    if (keyword.trim().length >= 2) {
      const currentQ = searchParams.get("q");
      const newQ = keyword.trim();

      if (currentQ === newQ) {
        setIsFocused(false);
        return;
      }

      navigate(`/search?q=${encodeURIComponent(newQ)}`);
      setIsFocused(false);
    }
  };

  const handleClear = () => {
    setKeyword("");
    inputRef.current?.focus();
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-2xl mx-auto px-4">
      {/* Search pill */}
      <motion.div
        animate={{
          boxShadow: isFocused
            ? "0 8px 30px rgba(0,0,0,0.12)"
            : "0 2px 8px rgba(0,0,0,0.08)",
        }}
        transition={{ duration: 0.2 }}
        className={`flex items-center gap-3 bg-white rounded-full px-4 py-3 border transition-colors duration-200
          ${isFocused ? "border-gray-300" : "border-gray-200"}`}
      >
        {/* Search icon */}
        <div className="flex-shrink-0">
          {loading ? (
            <Loader size={18} className="text-gray-400 animate-spin" />
          ) : (
            <Search
              size={18}
              className={isFocused ? "text-blue-500" : "text-gray-400"}
            />
          )}
        </div>

        {/* Input */}
        <input
          ref={inputRef}
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search for electricians, tutors, plumbers..."
          className="flex-1 bg-transparent text-sm text-gray-800 placeholder-gray-400 outline-none"
        />

        {/* Location indicator */}
        {userLocation?._normalized_city && (
          <div className="hidden sm:flex items-center gap-1 text-xs text-gray-400 border-l border-gray-200 pl-3 flex-shrink-0">
            <MapPin size={12} className="text-blue-400" />
            <span className="truncate max-w-[80px]">
              {userLocation._normalized_city}
            </span>
          </div>
        )}

        {/* Clear button */}
        {keyword && (
          <button
            onClick={handleClear}
            className="flex-shrink-0 w-6 h-6 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
          >
            <X size={12} className="text-gray-500" />
          </button>
        )}
      </motion.div>

      {/* Dropdown results */}
      <AnimatePresence>
        {showDropdown && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute left-4 right-4 top-14 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50"
          >
            {loading && results.length === 0 ? (
              <div className="flex items-center justify-center py-6 gap-2 text-gray-400">
                <Loader size={16} className="animate-spin" />
                <span className="text-sm">Searching nearby...</span>
              </div>
            ) : results.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-6 text-gray-400">
                <Search size={24} strokeWidth={1} className="mb-2" />
                <p className="text-sm">No results for "{keyword}"</p>
              </div>
            ) : (
              <>
                {results.map((service, i) => (
                  <motion.div
                    key={service._id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                    onClick={() => handleResultClick(service._id)}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-50 last:border-0"
                  >
                    {/* Service image or placeholder */}
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center flex-shrink-0 overflow-hidden">
                      {service.images?.[0]?.url ? (
                        <img
                          src={service.images[0].url}
                          alt=""
                          className="w-full h-full object-cover rounded-xl"
                        />
                      ) : (
                        <Search size={16} className="text-blue-400" />
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">
                        {service.serviceName}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-gray-400 truncate">
                          {service.category?.name}
                        </span>
                        {service.averageRating > 0 && (
                          <span className="text-xs text-yellow-500">
                            ★ {service.averageRating}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Distance */}
                    {service.distanceInKm != null && (
                      <div className="flex items-center gap-1 text-xs text-gray-400 flex-shrink-0">
                        <MapPin size={11} />
                        {service.distanceInKm < 1
                          ? `${(service.distanceInKm * 1000).toFixed(0)}m`
                          : `${service.distanceInKm.toFixed(1)}km`}
                      </div>
                    )}

                    {/* Boost badge */}
                    {service.isBoosted && (
                      <span className="text-[10px] bg-orange-50 text-orange-500 border border-orange-200 px-1.5 py-0.5 rounded-full flex-shrink-0">
                        Top
                      </span>
                    )}
                  </motion.div>
                ))}

                {/* See all results */}
                <button
                  onClick={handleSeeAll}
                  className="w-full px-4 py-3 text-sm text-blue-500 font-medium hover:bg-blue-50 transition-colors text-center border-t border-gray-100"
                >
                  See all results for "{keyword}" →
                </button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchBar;
