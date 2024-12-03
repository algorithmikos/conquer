import { useEffect, useRef } from "react";

type UseDebounceParams = {
  callback: () => void; // The callback to be executed
  value: any; // The value to debounce
  delay?: number; // The debounce delay in milliseconds
};
const useDebounce = ({
  callback,
  value,
  delay = 200,
}: UseDebounceParams): void => {
  const debounceTimeoutRef = useRef<number | null>(null);

  /*** UseEffects ***/
  // Debounce the search term update
  useEffect(() => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = window.setTimeout(() => {
      callback();
      // setStoreState(localState);
    }, delay); // Adjust delay as needed

    // Clean up the timeout if the component unmounts or if the input changes
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [value]);
};

export default useDebounce;
