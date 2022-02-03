import { player } from "@/features/music/player"
import { Song } from "@/features/music/types"
import { useStore } from "effector-react"
import { useEvent } from "effector-react/scope"
import Image from "next/image"
import React, { memo, FC, useState, useEffect } from "react"
import PauseIcon from "../ui/icons/PauseIcon/PauseIcon"
import PlayIcon from "../ui/icons/PlayIcon/PlayIcon"

interface TrackListItemProps {
    track: Song
}

const TrackListItem: FC<TrackListItemProps> = ({ track }) => {
    const playing = useStore(player.$playing)
    const volume = useStore(player.volume.$volume)
    const duration = useStore(player.$duration)
    const handleSelectTrack = useEvent(player.selectTrack)
    const currentTrack = useStore(player.$currentTrack)

    const [isCurrentTrack, setIsCurrentTrack] = useState(false)

    const handlePlay = useEvent(player.play)
    const handlePause = useEvent(player.pause)

    const progress = useStore(player.progress.$pgorgress)
    const handleChangeProgress = useEvent(player.progress.changeProgress)

    const handleChangeVolume = useEvent(player.volume.changeVolume)

    useEffect(() => {
        if (currentTrack && currentTrack!.id === track.id) setIsCurrentTrack(true)
        return () => setIsCurrentTrack(false)
    }, [currentTrack, track])

    const [seconds, setSeconds] = useState(0)
    const [minutes, setMinutes] = useState(0)

    const play = () => {
        if (!currentTrack || currentTrack.id !== track.id) return handleSelectTrack(track)
        if (playing) return handlePause()
        return handlePlay()
    }

    useEffect(() => {
        if (isCurrentTrack) {
            if (progress < 60) {
                setSeconds(progress)
            } else {
                setSeconds((prev) => progress % 60)
                setMinutes(Math.floor(progress / 60))
            }
        }

        return () => {
            setSeconds(0)
            setMinutes(0)
        }
    }, [progress, duration])

    return (
        <div className="flex  flex-col">
            <div className="grid grid-cols-12 items-center rounded bg-white py-2 shadow-sm">
                <button onClick={play} className="col-span-1 justify-self-center">
                    {isCurrentTrack ? (
                        playing ? (
                            <PauseIcon size="small" />
                        ) : (
                            <PlayIcon size="small" />
                        )
                    ) : (
                        <PlayIcon size="small" />
                    )}
                </button>
                <div className="col-span-7 flex space-x-2">
                    <Image
                        src={`${process.env.NEXT_PUBLIC_BACKEND}/images/${track.cover}`}
                        objectFit="contain"
                        height={40}
                        width={40}
                    />
                    <div className=" flex grow flex-col justify-center text-base">
                        <div className="flex grow">
                            <span className=" font-normal text-gray-800 after:mx-2 after:content-['-']">
                                {track.artist}
                            </span>

                            <span className=" truncate font-semibold">{track.name}</span>
                        </div>
                        {isCurrentTrack && (
                            <input type="range" min={0} max={duration} value={progress} disabled />
                        )}
                    </div>
                </div>
                {isCurrentTrack && (
                    <div className="col-span-1 col-start-10 mr-2 flex justify-self-end text-sm text-gray-800">
                        <span className="after:mx-1 after:content-['/']">
                            {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
                        </span>
                        <span>
                            {Math.floor(duration / 60)}:
                            {duration % 60 < 10 ? `0${duration & 60}` : duration % 60}
                        </span>
                    </div>
                )}
            </div>
        </div>
    )
}

export default memo(TrackListItem)
