import React, { useContext, useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, MapPin, Star, Zap, SlidersHorizontal, X } from "lucide-react";
import { AuthContext } from "../contexts/AuthProvider";
import { searchServices } from "../services/search";
import SkeletonCard2 from "../components/LoadingSkeleton/SkeletonCards2";
import SearchBar from "../components/search/SearchBar";

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get("q") || "";
  const navigate = useNavigate();
  const { userLocation } = useContext(AuthContext);

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  const fetchResults = async (pg = 1, reset = true) => {
    if (!keyword || keyword.trim().length < 2) return;
    setLoading(true);
    try {
      const res = await searchServices({
        keyword: keyword.trim(),
        longitude: userLocation?.coordinates?.[0],
        latitude: userLocation?.coordinates?.[1],
        page: pg,
        limit: 10,
      });
      const data = res.data.data || [];
      setResults((prev) => (reset ? data : [...prev, ...data]));
      setTotalCount(res.data.totalCount || 0);
      setHasMore(res.data.hasMore || false);
      setPage(pg);
    } catch (err) {
      console.error("Search error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults(1, true);
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [keyword, userLocation]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search bar at top */}
      <div className="bg-white border-b border-gray-200 py-4 sticky top-[55px] z-10">
        <SearchBar />
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* Results count */}
        {!loading && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm text-gray-500 mb-4"
          >
            {totalCount > 0
              ? `${totalCount} result${totalCount !== 1 ? "s" : ""} for "${keyword}"`
              : keyword.length >= 2
                ? `No results for "${keyword}"`
                : ""}
            {userLocation?._normalized_city && (
              <span className="ml-1 text-blue-500">
                near {userLocation._normalized_city}
              </span>
            )}
          </motion.p>
        )}

        {/* Results grid */}
        {loading && results.length === 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {new Array(8).fill(null).map((_, i) => (
              <div key={i} className="h-[300px]">
                <SkeletonCard2 index={i} />
              </div>
            ))}
          </div>
        ) : results.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-24 text-gray-400"
          >
            <Search size={48} strokeWidth={1} className="mb-4" />
            <p className="text-lg font-medium text-gray-600">
              No services found
            </p>
            <p className="text-sm mt-1">Try a different keyword or location</p>
            <button
              onClick={() => navigate("/")}
              className="mt-6 text-sm text-blue-500 font-medium hover:underline"
            >
              ← Browse all services
            </button>
          </motion.div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <AnimatePresence>
                {results.map((service, i) => (
                  <motion.div
                    key={service._id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    onClick={() =>
                      navigate(`/show-service-details/${service._id}`)
                    }
                    className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer overflow-hidden"
                  >
                    {/* Image */}
                    <div className="h-40 bg-gradient-to-br from-blue-100 to-blue-200 relative overflow-hidden">
                      {service.images?.[0]?.url ? (
                        <img
                          src={service.images[0].url}
                          alt={service.serviceName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Search size={32} className="text-blue-300" />
                        </div>
                      )}
                      {service.isBoosted && (
                        <span className="absolute top-2 left-2 flex items-center gap-1 bg-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                          <Zap size={9} /> Top
                        </span>
                      )}
                    </div>

                    {/* Info */}
                    <div className="p-3">
                      <p className="text-sm font-semibold text-gray-800 truncate">
                        {service.serviceName}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5 truncate">
                        {service.createdBy?.username} · {service.category?.name}
                      </p>

                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-1">
                          {service.averageRating > 0 && (
                            <>
                              <Star
                                size={11}
                                className="text-yellow-400 fill-yellow-400"
                              />
                              <span className="text-xs text-gray-600">
                                {service.averageRating}
                              </span>
                              <span className="text-xs text-gray-400">
                                ({service.ratingCount})
                              </span>
                            </>
                          )}
                        </div>
                        {service.distanceInKm != null && (
                          <div className="flex items-center gap-1 text-xs text-gray-400">
                            <MapPin size={10} />
                            {service.distanceInKm < 1
                              ? `${(service.distanceInKm * 1000).toFixed(0)}m`
                              : `${service.distanceInKm.toFixed(1)}km`}
                          </div>
                        )}
                      </div>

                      <p className="text-xs font-medium text-gray-700 mt-2">
                        ₹{service.priceRange?.minimum} – ₹
                        {service.priceRange?.maximum}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Load more */}
            {hasMore && (
              <div className="flex justify-center mt-8">
                <button
                  onClick={() => fetchResults(page + 1, false)}
                  disabled={loading}
                  className="bg-white border border-gray-200 text-gray-700 px-8 py-2.5 rounded-full text-sm font-medium hover:shadow-md transition-shadow disabled:opacity-50"
                >
                  {loading ? "Loading..." : "Show more"}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SearchResults;
