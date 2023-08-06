import clsx from "clsx";
import { useUnit } from "effector-react";
import { memo, InputHTMLAttributes } from "react";

import {
  $currentDuration,
  $currentTime,
  $isPressed,
  progressBarLifted,
  progressBarUplifted,
  sought,
} from "./model";

interface ProgressbarProps {
  className?: InputHTMLAttributes<HTMLInputElement>["className"];
  id?: string;
}

/**
 * компонент отвечающий за управление позиции в треке
 * @used Winamp, TrackListItem, TrackListItemSmall
 */
export const Progressbar = memo(({ className, id }: ProgressbarProps) => {
  const [currentDuration, currentTime, isPressed] = useUnit([
    $currentDuration,
    $currentTime,
    $isPressed,
  ]);

  const [handleMouseDown, handleMouseUp, handleSeeking] = useUnit([
    progressBarLifted,
    progressBarUplifted,
    sought,
  ]);

  return (
    <input
      id={id}
      type="range"
      min={0}
      max={currentDuration}
      value={currentTime}
      onChange={handleSeeking}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      className={clsx(
        className,
        isPressed && "active",
        currentDuration / 2 >= currentTime ? "left" : "right",
      )}
    />
  );
});
Progressbar.displayName = "Progressbar";
