import { useState, useEffect } from "react";

export default function useDebounce<T>(value: T, delay: number = 300): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);
    useEffect(() => {
        const timerId: ReturnType<typeof setTimeout> = setTimeout(() => {
            setDebouncedValue(value);
        });

        return () => clearTimeout(timerId);
    }, [value, delay]);

    return debouncedValue;
  }