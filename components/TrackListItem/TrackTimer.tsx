import { player } from "@/features/music/player"
import { Song } from "@/features/music/types"
import { useStore } from "effector-react"
import React, { memo, FC, useEffect, useState } from "react"

interface TrackTimerProps {}

const TrackTimer: FC<TrackTimerProps> = () => {
    const currentTime = useStore(player.progress.$currentTime)

    const [seconds, setSeconds] = useState(0)
    const [minutes, setMinutes] = useState(0)

    useEffect(() => {
        if (currentTime < 60) {
            setSeconds(Math.ceil(currentTime))
        } else {
            setSeconds(Math.ceil(currentTime % 60))
            setMinutes(Math.floor(currentTime / 60))
        }
    }, [currentTime])
    return (
        <span className="after:mx-1 after:content-['/']">
            {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
        </span>
    )
}

export default memo(TrackTimer)
