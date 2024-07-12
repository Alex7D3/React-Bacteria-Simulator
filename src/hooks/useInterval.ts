import { useEffect, useRef } from "react";

export default function useInterval(callback: () => void, delay: number | null): void {
  const savedCallback = useRef<() => void>(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delay) {
      const id = window.setInterval(savedCallback.current, delay);
      return () => window.clearInterval(id);
    }
  }, [delay])
}