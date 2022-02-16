import { TIME_MODE } from "@/features/media/constants"
import { progress, winamp } from "@/features/media/winamp"

import { useStore } from "effector-react"
import React, { memo, FC } from "react"

interface TrackTimerProps {}

const TrackTimer: FC<TrackTimerProps> = () => {
    const timeMode = useStore(winamp.$timeMode)

    const timer = useStore(progress.$timer)

    const { firstSecond, lastSecond, firstMinute, lastMinute } = timer

    return (
        <span className="after:mx-1 after:content-['/']">
            {timeMode === TIME_MODE.REMAINING && "-"}
            {firstMinute}
            {lastMinute}:{firstSecond}
            {lastSecond}
        </span>
    )
}

export default memo(TrackTimer)
