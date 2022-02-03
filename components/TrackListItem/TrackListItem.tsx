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
    const [loop, setLoop] = useState(false)

    const play = () => {
        if (!currentTrack || currentTrack.id !== track.id) return handleSelectTrack(track)
        if (playing) return handlePause()
        return handlePlay()
    }

    return (
        <div className="flex  flex-col">
            <div className="grid grid-cols-12 items-center">
                <button onClick={play} className="col-span-2">
                    {isCurrentTrack ? playing ? <PauseIcon /> : <PlayIcon /> : <PlayIcon />}
                </button>
                <div className="col-span-6 flex space-x-2">
                    <Image
                        src={`${process.env.NEXT_PUBLIC_BACKEND}/images/${track.cover}`}
                        objectFit="contain"
                        height={50}
                        width={50}
                    />
                    <div className=" flex grow flex-col">
                        <span className="text-base font-medium">{track.name}</span>
                        <span className="text-sm font-light text-gray-800">{track.artist}</span>
                    </div>
                </div>
                <span className="col-span-1 col-start-10 mr-2 flex justify-self-end text-sm text-gray-800">
                    {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
                </span>
                <input
                    type="range"
                    min={0}
                    max={100}
                    value={volume}
                    onChange={handleChangeVolume}
                    className="col-span-2 col-end-13"
                    onSeeking={() => console.log(`${volume.toString()}%`)}
                />
                {isCurrentTrack && (
                    <input
                        type="range"
                        min={0}
                        max={duration}
                        value={progress}
                        onChange={handleChangeProgress}
                        className="col-span-8 col-start-3"
                    />
                )}
            </div>

            <div className="flex flex-col">
                <label className="mb-2 flex items-center space-x-2">
                    <span>repeat</span>
                    <input type="checkbox" />
                    {/* checked={false} onChange={() => null} */}
                    {/* //onChange={hanldeLoopStateSet} */}
                </label>
            </div>
        </div>
    )
}

export default memo(TrackListItem)
