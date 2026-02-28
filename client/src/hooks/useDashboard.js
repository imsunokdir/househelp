import { useEffect, useState } from "react";
import {
  fetchDashboardStats,
  fetchDashboardActivity,
} from "../services/dashboard";

const useDashboard = () => {
  const [stats, setStats] = useState(null);
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const [statsRes, activityRes] = await Promise.all([
          fetchDashboardStats(),
          fetchDashboardActivity(),
        ]);
        setStats(statsRes.data.data);
        setActivity(activityRes.data.data);
      } catch (err) {
        setError("Failed to load dashboard.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return { stats, activity, loading, error };
};

export default useDashboard;
