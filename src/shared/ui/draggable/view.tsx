import { ReactNode, useRef } from "react";

import { WinampWindow } from "@/features/music/types";
import { useDraggable } from "@/src/shared/hooks/use-draggable";

interface DraggableProps {
  children: ReactNode;
  WINDOW_NAME: WinampWindow;
}

export const Draggable = ({ children, WINDOW_NAME }: DraggableProps) => {
  const ref = useRef<HTMLDivElement>(null);

  const [onDragStart, onDragging, onDragEnd] = useDraggable(WINDOW_NAME, ref);

  return (
    <div
      ref={ref}
      onMouseDown={onDragStart}
      onMouseMove={onDragging}
      onMouseUp={onDragEnd}

      //   style={{
      //     position: "absolute",
      //     top: 0,
      //     left: 0,
      //     transform: `translate(${w.x}px, ${w.y}px)`,
      //     touchAction: "none",
      //   }}
    >
      {children}
    </div>
  );
};
