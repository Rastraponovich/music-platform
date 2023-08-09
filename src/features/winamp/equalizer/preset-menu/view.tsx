import clsx from "clsx";
import { useList, useUnit } from "effector-react";
import { MouseEvent, ReactNode, memo, useRef } from "react";

import { TPreset } from "@/features/music/types";

import { winampStates } from "~/widgets/winamp/model";

import { useDraggable } from "~/shared/hooks/use-draggable";

import { $visiblePresetWindow } from "..";
import { loadPreset, toggleVisiblePresetWindow } from "..";
import { $presets, $selectedPreset, selectPreset } from "..";
import { WINDOW_NAME } from "./constants";

export const PresetMenu = () => {
  const visiblePresetWindow = useUnit($visiblePresetWindow);

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

interface PresetMenuButtonProps {
  onClick(): void;
  children: ReactNode;
}

const PresetMenuButton = memo(({ onClick, children }: PresetMenuButtonProps) => {
  return (
    <button
      onClick={onClick}
      className="w-16 border-[0.5px] border-[#adadad] bg-[#e1e1e1] py-1 text-center font-[Arial] text-[10px]   leading-[8px] tracking-wide first-letter:uppercase  hover:border-[#0078d7] hover:bg-[#eeeeee]  active:border-[#0078d7]"
    >
      {children}
    </button>
  );
});

PresetMenuButton.displayName = "PresetMenuButton";

const LoadPresetButton = () => {
  const setPresetButtonClicked = useUnit(loadPreset);

  return <PresetMenuButton onClick={setPresetButtonClicked}>загрузить</PresetMenuButton>;
};
const ClosePresetMenuButton = () => {
  const cancelButtonClicked = useUnit(toggleVisiblePresetWindow);

  return <PresetMenuButton onClick={cancelButtonClicked}>отмена</PresetMenuButton>;
};

interface PresetProps {
  preset: TPreset;
}

/**
 * @todo semantic refactor
 */
const Preset = memo<PresetProps>(({ preset }) => {
  const [selected, handleSelectPreset] = useUnit([$selectedPreset, selectPreset]);

  return (
    <div
      className={clsx(
        "lowercase first-letter:uppercase ",
        selected?.name === preset.name && "bg-[#0078d7] text-white",
      )}
      onClick={() => handleSelectPreset(preset)}
    >
      {preset.name}
    </div>
  );
});

Preset.displayName = "Preset";

const PresetsList = () => {
  const selectedPreset = useUnit($selectedPreset);

  return (
    <div className="flex flex-col  overflow-y-scroll border-[0.5px] border-[#828790] bg-white p-px">
      {useList($presets, {
        keys: [selectedPreset],
        fn: (preset) => <Preset preset={preset} />,
      })}
    </div>
  );
};

interface PresetTitleProps {
  onMouseDown: (e: MouseEvent<HTMLElement>) => void;
  onMouseMove: (e: MouseEvent<HTMLElement>) => void;
  onMouseUp: (e: MouseEvent<HTMLElement>) => void;
  onMouseLeave: (e: MouseEvent<HTMLElement>) => void;
}

const PresetTitle = memo(
  ({ onMouseDown, onMouseMove, onMouseUp, onMouseLeave }: PresetTitleProps) => {
    const activeWindow = useUnit(winampStates.$activeWindow);

    return (
      <h3
        className={clsx(
          "  bg-white px-[2px] py-[4px] text-gray-400 first-letter:uppercase",
          activeWindow === WINDOW_NAME && "bg-[#0078d7] text-gray-50",
        )}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseLeave}
      >
        загрузка заготовки для эквалайзера
      </h3>
    );
  },
);

PresetTitle.displayName = "PresetTitle";
