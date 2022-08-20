import Image from "next/image"
import { useStore } from "effector-react"
import { memo, FC, useState, useMemo } from "react"

import { useEvent } from "effector-react/scope"

import { Song } from "@/features/music/types"

import TrackTimer from "./TrackTimer"
import { Progressbar } from "@/src/shared/ui/winamp/progress-bar"
import { playlist, winamp, winampControls } from "@/features/media/winamp"
import { MEDIA_STATUS } from "@/features/media/constants"

import clsx from "clsx"
import Comments from "./Comments"
import { convertTimeToObj } from "@/utils/utils"
import { AnnotationIcon, HeartIcon, PlusSmIcon, TrashIcon } from "@heroicons/react/outline"
import { PauseIcon, PlayIcon, HeartIcon as Fav } from "@heroicons/react/solid"

interface TrackListItemProps {
    track: Song
    isCurrentTrack: boolean
    addToFavorites?(id: Song["id"]): void
    favorite?: boolean
}

const TrackListItem: FC<TrackListItemProps> = ({
    track,
    isCurrentTrack,
    addToFavorites,
    favorite,
}) => {
    // console.log("render track", track.name)

    const mediaStatus = useStore(winamp.$mediaStatus)

    const { firstMinute, lastSecond, lastMinute, firstSecond } = useMemo(
        () => convertTimeToObj(track?.metaData?.format.duration),
        [track]
    )

    const [handleSelectTrack, handlePlay, handlePause, handleAddToPlayList] = useEvent([
        winamp.selectTrackFromList,
        winampControls.play,
        winampControls.pause,
        playlist.addTrackToPlaylist,
    ])

    const play = () => {
        if (!isCurrentTrack) return handleSelectTrack(track)
        if (mediaStatus === "PLAYING") return handlePause()
        return handlePlay()
    }

    const [comments, showComments] = useState(false)

    const toggleComments = () => showComments((prev) => !prev)

    const handleAddToFavorites = () => {
        addToFavorites!(track!.id)
    }

    const needToShow = isCurrentTrack && mediaStatus !== MEDIA_STATUS.STOPPED

    return (
        <div className="relative  flex flex-col overflow-hidden shadow-sm">
            <div
                className={clsx(
                    "z-20 grid grid-cols-12 items-center rounded bg-white p-2",
                    comments && "drop-shadow-xl"
                )}
            >
                <button
                    onClick={play}
                    className={clsx(
                        "col-span-1 justify-self-center text-gray-500 duration-150 hover:text-black",
                        isCurrentTrack &&
                            mediaStatus === "PLAYING" &&
                            "animate-pulse  text-black hover:animate-none"
                    )}
                    title="play/pause"
                >
                    {isCurrentTrack ? (
                        mediaStatus === "PLAYING" ? (
                            // <PauseIcon size="small" />
                            <PauseIcon className="h-8 w-8" />
                        ) : (
                            <PlayIcon className="h-8 w-8" />
                        )
                    ) : (
                        <PlayIcon className="h-8 w-8" />
                    )}
                </button>
                <div className="col-span-7 flex space-x-2">
                    <Image
                        src={`${process.env.NEXT_PUBLIC_BACKEND}/images/${track.cover}`}
                        objectFit="contain"
                        height={40}
                        width={40}
                        alt={`${track.artist} ${track.name}`}
                    />
                    <div className=" flex grow flex-col justify-center text-base">
                        <div className="flex grow">
                            <span className=" font-normal text-gray-800 after:mx-2 after:content-['-']">
                                {track.artist}
                            </span>

                            <span className=" truncate font-semibold">{track.name}</span>
                        </div>
                        {needToShow && <Progressbar />}
                    </div>
                </div>
                <div className="col-span-1 col-start-10 mr-2 flex justify-self-end text-sm text-gray-800">
                    {needToShow && <TrackTimer />}

                    <span>
                        {firstMinute}
                        {lastMinute}:{firstSecond}
                        {lastSecond}
                    </span>
                </div>

                <div className="col-span-2 col-end-13 flex items-center justify-end space-x-2 justify-self-start">
                    <button
                        onClick={() => handleAddToPlayList(track)}
                        title="добавить в плейлист winamp"
                    >
                        <PlusSmIcon className="h-6 w-6 text-gray-500 duration-200 hover:animate-cross-spin hover:text-gray-900" />
                    </button>

                    <button
                        className="group indicator"
                        onClick={toggleComments}
                        title="показать\скрыть комментарии"
                    >
                        <span className="badge indicator-item badge-sm cursor-pointer border-gray-500 bg-gray-500 group-hover:border-gray-900 group-hover:bg-gray-900">
                            {track.comments.length}
                        </span>
                        <AnnotationIcon className="h-6 w-6 text-gray-500 duration-200 group-hover:text-gray-900" />
                    </button>

                    <button onClick={toggleComments} title="показать\скрыть комментарии">
                        <TrashIcon className="h-5 w-6 text-gray-500 duration-200 group-hover:text-gray-900" />
                    </button>
                    <button onClick={handleAddToFavorites} title="добавить в избранное">
                        {!favorite ? (
                            <HeartIcon className=" h-5 w-6 text-gray-500 duration-200 group-hover:text-gray-900" />
                        ) : (
                            <Fav className=" h-5 w-6 text-gray-500 duration-200 group-hover:text-gray-900" />
                        )}
                    </button>
                </div>
            </div>
            <Comments opened={comments} comments={track.comments} />
        </div>
    )
}

export default memo(TrackListItem)
