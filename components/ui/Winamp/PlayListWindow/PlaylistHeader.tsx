import clsx from "clsx";
import { useUnit } from "effector-react";
import { memo, MouseEventHandler } from "react";

import { winampStates } from "@/src/widgets/winamp/model";

interface PlaylistHeaderProps {
  onMouseDown: MouseEventHandler;
  onMouseMove: MouseEventHandler;
  onMouseUp: MouseEventHandler;
  onMouseLeave: MouseEventHandler;
}
const WINDOW_NAME = "PLAYLIST";

const PlaylistHeader = ({
  onMouseDown,
  onMouseMove,
  onMouseUp,
  onMouseLeave,
}: PlaylistHeaderProps) => {
  const windowState = useUnit(winampStates.$activeWindow);
  return (
    <div
      className={clsx(
        "playlist-top draggable relative flex min-h-[20px] w-full min-w-[20px] cursor-winamp-move",
        windowState === WINDOW_NAME && "active",
      )}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseLeave}
    >
      <div className="playlist-top-left draggable w-[25px]"></div>
      <div className="playlist-top-left-spacer draggable w-3"></div>
      <div className="playlist-top-left-fill draggable grow "></div>
      <div className="playlist-top-title draggable w-[100px]"></div>
      <div className="playlist-top-right-spacer draggable w-[13px]"></div>
      <div className="playlist-top-right-fill draggable grow"></div>
      <div className="playlist-top-right draggable w-[25px]">
        <div id="playlist-shade-button" className=""></div>
        <div id="playlist-close-button" className=""></div>
      </div>
    </div>
  );
};

export default memo(PlaylistHeader);
