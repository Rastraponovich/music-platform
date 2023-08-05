import { useUnit } from "effector-react";
import { TIME_MODE } from "@/features/media/constants";
import { progress, winamp } from "@/src/widgets/winamp/model";

const TrackTimer = () => {
  const timeMode = useUnit(winamp.$timeMode);

  const timer = useUnit(progress.$timer);

  const { firstSecond, lastSecond, firstMinute, lastMinute } = timer;

  return (
    <span className="after:mx-1 md:after:content-['/']">
      {timeMode === TIME_MODE.REMAINING && "-"}
      {firstMinute}
      {lastMinute}:{firstSecond}
      {lastSecond}
    </span>
  );
};

export default TrackTimer;
