import { useEffect } from "react";

export function useUnloadWarning(shouldWarn = true) {
  useEffect(() => {
    if (!shouldWarn) return;

    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [shouldWarn]);
}