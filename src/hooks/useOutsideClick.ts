import { useEffect } from "react";

export const useOutsideClick = (
  ref: React.RefObject<HTMLDivElement | null>,
  close: () => void
) => {
  useEffect(() => {
    const listener = (e: MouseEvent) => {
      // console.log("ref current: ", ref?.current);
      // console.log("e.target: ", e.target);
      if (!ref?.current || ref?.current.contains(e.target as Node)) {
        return;
      }
      close();
    };

    document.addEventListener("mousedown", listener);

    return () => {
      document.removeEventListener("mousedown", listener);
    };
  }, [ref, close]);
};
