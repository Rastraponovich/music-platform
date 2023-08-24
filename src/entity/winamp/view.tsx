import clsx from "clsx";
import { useUnit } from "effector-react";
import { memo } from "react";

import { $timeMode, $timer, toggleTimeMode, winamp } from "~/widgets/winamp";

import { CharacterString } from "~/shared/ui/winamp/character-strings";

import { TimeMode } from "./constants";

interface MiniTimerProps {
  className?: string;
}

export const MiniTimer = memo<MiniTimerProps>(({ className }) => {
  const playerState = useUnit(winamp.$mediaStatus);
  const timeMode = useUnit($timeMode);

  const timer = useUnit($timer);

  const { firstSecond, lastSecond, firstMinute, lastMinute } = timer;
  const handleSwitchTimeMode = useUnit(toggleTimeMode);

  return (
    <div
      className={clsx(
        playerState === "PAUSED" && "animate-w-blink",
        playerState === "STOPPED" && "hidden",
        "align-text-center flex h-2.5",
        className,
      )}
      onClick={handleSwitchTimeMode}
    >
      <CharacterString>{timeMode === TimeMode.REMAINING ? "-" : " "}</CharacterString>
      <CharacterString className="ml-px h-1.5 w-[5px]">{firstMinute}</CharacterString>
      <CharacterString className="ml-px h-1.5 w-[5px]">{lastMinute}</CharacterString>
      <CharacterString className="ml-[3px] h-1.5 w-[5px]">{firstSecond}</CharacterString>
      <CharacterString className="ml-px h-1.5 w-[5px]">{lastSecond}</CharacterString>
    </div>
  );
});

MiniTimer.displayName = "MiniTimer";
