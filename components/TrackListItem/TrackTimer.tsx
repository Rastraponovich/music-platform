import { player } from "@/features/music/player"
import { Song } from "@/features/music/types"
import { useStore } from "effector-react"
import React, { memo, FC, useEffect, useState } from "react"

interface TrackTimerProps {
    isCurrentTrack: boolean
    metaData: Song["metaData"]
}

const TrackTimer: FC<TrackTimerProps> = ({ isCurrentTrack, metaData }) => {
    console.log("render timer", isCurrentTrack)

    const progress = useStore(player.progress.$progress)

    const [seconds, setSeconds] = useState(0)
    const [minutes, setMinutes] = useState(0)

    useEffect(() => {
        if (isCurrentTrack) {
            if (progress < 60) {
                setSeconds(progress)
            } else {
                setSeconds(progress % 60)
                setMinutes(Math.floor(progress / 60))
            }
        }
    }, [progress, isCurrentTrack])
    return (
        <div className="col-span-1 col-start-10 mr-2 flex justify-self-end text-sm text-gray-800">
            {isCurrentTrack && (
                <span className="after:mx-1 after:content-['/']">
                    {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
                </span>
            )}
            <span>
                {Math.floor(metaData.format?.duration / 60)}:
                {metaData.format?.duration % 60 < 10
                    ? `0${metaData.format?.duration & 60}`
                    : Math.ceil(metaData.format?.duration % 60)}
            </span>
        </div>
    )
}

export default memo(TrackTimer)
