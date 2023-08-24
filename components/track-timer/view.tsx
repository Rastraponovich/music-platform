import { useUnit } from "effector-react";
import { TimeMode } from "~/entity/winamp";

import { $timeMode, $timer } from "~/widgets/winamp";

//TODO: refactor
export const TrackTimer = () => {
  const [timeMode, timer] = useUnit([$timeMode, $timer]);

  const { firstSecond, lastSecond, firstMinute, lastMinute } = timer;

  return (
    <span
      className="after:mx-1 md:after:content-['/']"
      title={`${
        timeMode === TimeMode.REMAINING && "-"
      } ${firstMinute} ${lastMinute}:${firstSecond} ${lastSecond}`}
    >
      {timeMode === TimeMode.REMAINING && "-"}
      {firstMinute}
      {lastMinute}:{firstSecond}
      {lastSecond}
    </span>
  );
};
