import { useEffect, useState } from "react"

export const useLocalStorage = (key: string) => {
  const [value, setValue] = useState(localStorage.getItem(key));
  
  useEffect(() => {
    if(value !== null) localStorage.setItem(key, value);
  }, [key, value]);

  return [value, setValue] as const;
}