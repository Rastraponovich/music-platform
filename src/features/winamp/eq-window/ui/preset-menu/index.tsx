import { eq } from "@/src/widgets/winamp/model";
import { useDraggable } from "@/src/shared/hooks/use-draggable";
import clsx from "clsx";
import { useStore } from "effector-react";
import { useRef } from "react";
import { ClosePresetMenuButton, LoadPresetButton } from "./menu-button";
import { PresetsList } from "./preset-list";
import { PresetTitle } from "./title";

const WINDOW_NAME = "PRESETS";

export const PresetMenu = () => {
  const visiblePresetWindow = useStore(eq.$visiblePresetWindow);

  const ref = useRef(null);

  const [onDragStart, onDragging, onDragEnd] = useDraggable(WINDOW_NAME, ref);

  return (
    <div
      className={clsx(
        "fixed left-12 z-50 flex  w-[275px] flex-col text-xs shadow-md",
        !visiblePresetWindow && "hidden",
      )}
      ref={ref}
    >
      <PresetTitle
        onMouseDown={onDragStart}
        onMouseMove={onDragging}
        onMouseUp={onDragEnd}
        onMouseLeave={onDragEnd}
      />

      <div className="flex flex-col bg-[#f0f0f0] p-3">
        <PresetsList />
        <div className="mt-2 flex space-x-2 self-end ">
          <LoadPresetButton />
          <ClosePresetMenuButton />
        </div>
      </div>
    </div>
  );
};
