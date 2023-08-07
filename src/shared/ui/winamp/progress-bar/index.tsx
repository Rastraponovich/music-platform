import clsx from "clsx";
import { useUnit } from "effector-react";
import { memo, InputHTMLAttributes, useState, MouseEvent } from "react";

import { $currentTrackDuration, $currentTrackTime, marqueInfo } from "@/src/widgets/winamp/model";
import {
  sought,
  progressBarLifted,
  progressBarUplifted,
} from "@/src/features/winamp/progress-bar/model";

interface ProgressbarProps {
  className?: InputHTMLAttributes<HTMLInputElement>["className"];
  id?: string;
}

/**
 * компонент отвечающий за управление позиции в треке
 * @used Winamp, TrackListItem, TrackListItemSmall
 * @deprecated
 */
export const Progressbar = memo(({ className, id }: ProgressbarProps) => {
  const [active, setActive] = useState(false);

  const [currentTrackDuration, currentTime] = useUnit([$currentTrackDuration, $currentTrackTime]);

  const [handleMouseDown, handleMouseUp] = useUnit([
    marqueInfo.enabledMarqueInfo,
    marqueInfo.disabledMarqueInfo,
  ]);

  const [handleSeeking, mouseDown, mouseUp] = useUnit([
    sought,
    progressBarLifted,
    progressBarUplifted,
  ]);

  const onMouseDown = (e: MouseEvent<HTMLInputElement>) => {
    mouseDown(e);
    setActive(true);
    handleMouseDown();
  };

  const onMouseUp = (e: MouseEvent<HTMLInputElement>) => {
    mouseUp(e);
    setActive(false);
    handleMouseUp();
  };

  return (
    <input
      id={id}
      type="range"
      min={0}
      max={currentTrackDuration}
      value={currentTime}
      onChange={handleSeeking}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      className={clsx(
        className,
        active && "active",
        currentTrackDuration / 2 >= currentTime ? "left" : "right",
      )}
    />
  );
});
Progressbar.displayName = "Progressbar";
