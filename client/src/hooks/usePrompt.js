import { useContext, useEffect } from "react";
import { UNSAFE_NavigationContext as NavigationContext } from "react-router-dom";

export default function usePrompt(message, when) {
  const navigator = useContext(NavigationContext).navigator;

  useEffect(() => {
    if (!when) return;

    const push = navigator.push;
    const blocker = navigator.block((tx) => {
      if (window.confirm(message)) {
        blocker();
        tx.retry();
      }
    });

    return () => blocker();
  }, [when, message, navigator]);
}
