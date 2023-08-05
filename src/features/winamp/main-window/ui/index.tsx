import clsx from "clsx";
import { useEvent, useStore } from "effector-react";
import { useRef } from "react";

import { $clutterBar, winampStates } from "@/src/widgets/winamp/model";

import { useDraggable } from "@/hooks/useDraggable";

import { WindowControls } from "./controls-buttons";
// import { TitleBar } from "./title-bar";
import { StatusBar } from "./status-bar";
// import { MediaInfo } from "../media-info";
import { ControlsPanel } from "~/features/winamp/controls-panel";
import { Progressbar } from "~/features/winamp/progress-bar";
import { BalanceBar } from "~/features/winamp/balance-bar";
import { VolumeBar } from "~/features/winamp/volume-bar";
import { TitleBar } from "~/features/winamp/title-bar";
import { MediaInfo } from "@/src/widgets/player-window";

const WINDOW_NAME = "PLAYER";

export const MainWindow = () => {
  const visiblePlayer = useStore(winampStates.$visiblePlayer);

  const clutter = useStore($clutterBar);

  const shade = useStore(winampStates.$shadePlayer);

  const ref = useRef(null);

  const [onDragStart, onDragging, onDragEnd] = useDraggable(WINDOW_NAME, ref);

  const handleActiveWindow = useEvent(winampStates.changeWindowState);

  return (
    <aside
      id="main-window"
      className={clsx(
        "fixed z-50  flex h-[116px]  cursor-winamp flex-col bg-transparent pb-[9px] shadow-md",
        // hidden && " overflow-hidden", //minimize state
        "w-[275px]",
        !visiblePlayer && "hidden",
        shade && "max-h-3.5 overflow-hidden pb-0",
        clutter.d && "origin-top-left scale-[2]",
      )}
      ref={ref}
      onClick={() => handleActiveWindow(WINDOW_NAME)}
    >
      <TitleBar
        onMouseDown={onDragStart}
        onMouseMove={onDragging}
        onMouseUp={onDragEnd}
        onMouseLeave={onDragEnd}
      />
      <div className="my-2 flex pr-2 pl-[9px]">
        <StatusBar />
        <MediaInfo />
        <VolumeBar />
        <BalanceBar />
        <WindowControls />
      </div>

      <Progressbar
        id="position"
        className="slider-thumb ml-4  mb-[7px] h-2.5 w-[248px] appearance-none bg-progresbar-player"
      />
      <ControlsPanel />
    </aside>
  );
};
