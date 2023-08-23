import { useUnit } from "effector-react";

import { TIME_MODE } from "@/features/media/constants";

import { $timeMode, $timer } from "~/widgets/winamp/model";

export const TrackTimer = () => {
  const [timeMode, timer] = useUnit([$timeMode, $timer]);

  const { firstSecond, lastSecond, firstMinute, lastMinute } = timer;

  return (
    <span
      className="after:mx-1 md:after:content-['/']"
      title={`${
        timeMode === TIME_MODE.REMAINING && "-"
      } ${firstMinute} ${lastMinute}:${firstSecond} ${lastSecond}`}
    >
      {timeMode === TIME_MODE.REMAINING && "-"}
      {firstMinute}
      {lastMinute}:{firstSecond}
      {lastSecond}
    </span>
  );
};
