import { useEffect, useState } from "react";

export default function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState<boolean>(false);

  useEffect(() => {
    const handleOnline = () => {
      // When the online event is triggered, verify the internet connection
      checkInternetConnection().then((isConnected) => setIsOnline(isConnected));
    };

    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Verify connection on initial load in case navigator.onLine is inaccurate
    if (navigator.onLine) {
      checkInternetConnection().then((isConnected) => setIsOnline(isConnected));
    }

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return isOnline;
}

const checkInternetConnection = async () => {
  try {
    // Ping a reliable URL to verify internet connection
    const response = await fetch("https://www.google.com", {
      method: "HEAD",
      mode: "no-cors",
    });
    return response.ok || true; // Consider it online if the fetch succeeds
  } catch {
    return false; // No internet connection
  }
};
