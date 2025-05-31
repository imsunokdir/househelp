import { useContext, useEffect } from "react";
import axios from "axios";
import { AuthContext } from "../contexts/AuthProvider";
import throttle from "lodash/throttle";
import { update } from "lodash";
import { updateLastActive } from "../services/user";

const TrackUserActivity = () => {
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (!user) return;
// will trigger at most once every 10 seconds
    const handleActivity = throttle(() => {
      console.log("event triggered");
      updateLastActive();
    }, 10000); 

    const activityEvents = ["click", "scroll", "mousemove", "keydown"];

    activityEvents.forEach((event) => {
      window.addEventListener(event, handleActivity);
    });

    return () => {
      activityEvents.forEach((event) => {
        window.removeEventListener(event, handleActivity);
      });
    };
  }, [user]);

  return null;
};

export default TrackUserActivity;
