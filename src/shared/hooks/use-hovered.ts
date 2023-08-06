import { useEffect, useState } from "react";

const cursorPositionRef = { current: { pageX: 0, pageY: 0 } };

window.document.addEventListener("mousemove", ({ pageX, pageY }) => {
  cursorPositionRef.current = { pageX, pageY };
});

// We use a single global event listener because there is no way to get the
// mouse position aside from an event. Ideally we could create/clean up the
// event listener in the hook, but in the case where we want to check the cursor
// position on mount, that we wouldn't have had time to capture an event.
function useCursorPositionRef() {
  return cursorPositionRef;
}

export function useIsHovered() {
  const cursorRef = useCursorPositionRef();
  const [hover, setHover] = useState(false);
  const [node, setNode] = useState<HTMLElement | null>(null);

  useEffect(() => {
    if (node == null) {
      setHover(false);
      return;
    }
    const domRect = node.getBoundingClientRect();
    const { pageX, pageY } = cursorRef.current;

    setHover(
      pageX >= domRect.left &&
        pageX <= domRect.right &&
        pageY >= domRect.top &&
        pageY <= domRect.bottom,
    );

    const enter = () => setHover(true);

    const leave = () => setHover(false);

    node.addEventListener("mouseenter", enter);
    node.addEventListener("mouseleave", leave);

    return () => {
      node.removeEventListener("mouseenter", enter);
      node.removeEventListener("mouseleave", leave);
    };
  }, [node, cursorRef]);

  return { ref: setNode, hover };
}
