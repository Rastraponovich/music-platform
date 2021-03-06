import Image from "next/image"
import { useStore } from "effector-react"
import { memo, FC, useState, useMemo } from "react"

import { useEvent } from "effector-react/scope"

import { Song } from "@/features/music/types"

import TrackTimer from "./TrackTimer"
import Progressbar from "../ui/Progressbar/Progressbar"
import { duration, playlist, progress, winamp, winampControls } from "@/features/media/winamp"
import { MEDIA_STATUS } from "@/features/media/constants"

import clsx from "clsx"
import Comments from "./Comments"
import { convertTimeToObj } from "@/utils/utils"
import { AnnotationIcon, PlusSmIcon } from "@heroicons/react/outline"
import { PauseIcon, PlayIcon } from "@heroicons/react/solid"

interface TrackListItemProps {
    track: Song
    isCurrentTrack: boolean
}

const TrackListItemSmall = ({ track, isCurrentTrack }: TrackListItemProps) => {
    // console.log("render track", track.name)
    const mediaStatus = useStore(winamp.$mediaStatus)

    const { firstMinute, lastSecond, lastMinute, firstSecond } = useMemo(
        () => convertTimeToObj(track?.metaData?.format.duration),
        [track]
    )

    const [handleSelectTrack, handlePlay, handlePause] = useEvent([
        winamp.selectTrackFromList,
        winampControls.play,
        winampControls.pause,
    ])

    const play = () => {
        if (!isCurrentTrack) return handleSelectTrack(track)
        if (mediaStatus === "PLAYING") return handlePause()
        return handlePlay()
    }

    const needToShow = isCurrentTrack && mediaStatus !== MEDIA_STATUS.STOPPED
    const currentTrackDuration = useStore(duration.$currentTrackDuration)
    const currentTrackTime = useStore(progress.$currentTime)

    return (
        <div
            className={clsx(
                "group relative flex flex-col overflow-hidden shadow-sm duration-200",
                isCurrentTrack && "my-2 drop-shadow-xl"
            )}
        >
            {needToShow && (
                <progress
                    className="progress-primary  h-0.5 w-full"
                    value={currentTrackTime}
                    max={currentTrackDuration}
                ></progress>
            )}

            <div className="z-20 grid grid-cols-12 items-center rounded bg-white py-2 px-1 group-hover:bg-gray-200 md:pr-2">
                <button
                    onClick={play}
                    className={clsx(
                        "col-span-1 justify-self-start text-gray-500 duration-150 hover:text-black md:justify-self-center",
                        isCurrentTrack &&
                            mediaStatus === "PLAYING" &&
                            "animate-pulse  text-black hover:animate-none"
                    )}
                    title="play/pause"
                >
                    {isCurrentTrack ? (
                        mediaStatus === "PLAYING" ? (
                            // <PauseIcon size="small" />
                            <PauseIcon className="h-6 w-6 md:h-10 md:w-10" />
                        ) : (
                            <PlayIcon className="h-6 w-6 md:h-10 md:w-10" />
                        )
                    ) : (
                        <PlayIcon className="h-6 w-6 md:h-10 md:w-10" />
                    )}
                </button>
                <div className="col-span-8 flex items-center space-x-2 md:col-span-10">
                    <div className="relative  h-5 w-5 md:h-10 md:w-10">
                        <Image
                            src={`${process.env.NEXT_PUBLIC_BACKEND}/images/${track.cover}`}
                            objectFit="contain"
                            alt={`${track.artist} ${track.name}`}
                            layout="fill"
                        />
                    </div>

                    <div className=" flex grow flex-col justify-center text-xs md:flex-row md:justify-start md:text-base">
                        <span className=" font-normal text-gray-800 after:mx-2 md:after:content-['-']">
                            {track.artist}
                        </span>
                        <span className=" truncate font-semibold">{track.name}</span>
                    </div>
                </div>
                <div className="col-span-1 col-start-12  flex flex-col justify-self-end text-xs text-gray-800 md:col-start-13 md:flex-row md:text-sm">
                    {needToShow && <TrackTimer />}

                    <span>
                        {firstMinute}
                        {lastMinute}:{firstSecond}
                        {lastSecond}
                    </span>
                </div>
            </div>
        </div>
    )
}

export default memo(TrackListItemSmall)
