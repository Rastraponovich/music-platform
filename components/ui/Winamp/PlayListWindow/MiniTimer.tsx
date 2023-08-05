import clsx from "clsx";
import { useUnit } from "effector-react";
import { progress, winamp } from "@/src/widgets/winamp/model";

import { TIME_MODE } from "@/features/music/types";
import { CharacterString } from "@/src/shared/ui/winamp/character-strings";

interface MiniTimerProps {
  className?: string;
}

const MiniTimer = ({ className }: MiniTimerProps) => {
  const playerState = useUnit(winamp.$mediaStatus);
  const timeMode = useUnit(winamp.$timeMode);

  const timer = useUnit(progress.$timer);

  const { firstSecond, lastSecond, firstMinute, lastMinute } = timer;
  const handleSwitchTimeMode = useUnit(winamp.toggleTimeMode);

  return (
    <div
      className={clsx(
        playerState === "PAUSED" && "animate-w-blink",
        playerState === "STOPPED" && "hidden",
        "align-text-center flex h-2.5 ",
        className,
      )}
      onClick={handleSwitchTimeMode}
    >
      <CharacterString>{timeMode === TIME_MODE.REMAINING ? "-" : " "}</CharacterString>
      <CharacterString className="ml-[1px] h-[6px] w-[5px]">{firstMinute}</CharacterString>
      <CharacterString className="ml-[1px] h-[6px] w-[5px]">{lastMinute}</CharacterString>
      <CharacterString className="ml-[3px] h-[6px] w-[5px]">{firstSecond}</CharacterString>
      <CharacterString className="ml-[1px] h-[6px] w-[5px]">{lastSecond}</CharacterString>
    </div>
  );
};

export default MiniTimer;
