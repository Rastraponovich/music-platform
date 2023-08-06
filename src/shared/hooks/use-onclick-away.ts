import { useEffect } from "react";

export function useOnClickAway(ref: Element | null, callback: null | (() => void)) {
  useEffect(() => {
    if (ref == null || callback == null) {
      return;
    }

    const handleClickOut = (event: MouseEvent) => {
      const clickOutTarget = event.target;

      if (!(clickOutTarget instanceof Element)) {
        return; // TypeScript doesn't realize this will always be true
      }

      if (ref.contains(clickOutTarget)) {
        return;
      }

      // If the click is _not_ inside the menu.
      callback();
      window.document.removeEventListener("click", handleClickOut, {
        capture: true,
      });
    };

    window.document.addEventListener("click", handleClickOut, {
      capture: true,
    });

    return () => {
      window.document.removeEventListener("click", handleClickOut, {
        capture: true,
      });
    };
  }, [ref, callback]);
}
