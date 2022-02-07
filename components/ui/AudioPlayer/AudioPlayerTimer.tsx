import { player } from "@/features/music/player"
import { useStore } from "effector-react"
import React, { memo, FC, useEffect, useState } from "react"

interface AudioPlayerTimerProps {}

const AudioPlayerTimer: FC<AudioPlayerTimerProps> = () => {
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

        return () => {
            setSeconds(0)
            setMinutes(0)
        }
    }, [currentTime])
    return (
        <span className="col-span-1 col-start-10 mr-2 flex justify-self-end text-sm text-gray-800">
            {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
        </span>
    )
}

export default memo(AudioPlayerTimer)
