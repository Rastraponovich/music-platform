import { useStore } from "effector-react"
import { TIME_MODE } from "@/features/media/constants"
import { progress, winamp } from "@/features/media/winamp"

interface TrackTimerProps {}

const TrackTimer = () => {
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

export default TrackTimer
