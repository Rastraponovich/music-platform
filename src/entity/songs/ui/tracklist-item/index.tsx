import clsx from "clsx"
import Image from "next/image"
import { useList, useStore } from "effector-react"
import { memo, useState, useMemo, useCallback } from "react"

import { useEvent } from "effector-react/scope"

import { MEDIA_STATUS } from "@/features/media/constants"
import { Progressbar } from "@/src/shared/ui/winamp/progress-bar"
import { playlist, winamp, winampControls } from "@/src/widgets/winamp/model"

import Comments from "@/components/TrackListItem/Comments"
import TrackTimer from "@/components/TrackListItem/TrackTimer"
import { convertTimeToObj } from "@/utils/utils"

import { PauseIcon, PlayIcon } from "@heroicons/react/solid"
import { songLib } from "../.."
import { $songs, actions, selectors } from "../../model"
import { Actions } from "./buttons"

/**
 * интерфейс TrackListItem
 */
interface TrackListItemProps {
    track: songLib.Song
    isCurrentTrack: boolean
}

/**
 * ui Трека из списка треков
 * @param {boolean} isCurrentTrack
 * @param {track} songLib.Song
 */
export const TrackListItem = memo(({ track, isCurrentTrack }: TrackListItemProps) => {
    const mediaStatus = useStore(winamp.$mediaStatus)

    const [hovered, setHovered] = useState(false)

    const isFavorite = selectors.useFavoriteTrack(track?.id) || false

    const handleAddToFavButtonClicked = useEvent(actions.addToFavoriteButtonClicked)

    const { firstMinute, lastSecond, lastMinute, firstSecond } = useMemo(
        () => convertTimeToObj(track?.metaData?.format.duration),
        [track]
    )

    const [handleSelectTrack, handlePlay, handlePause, addToPlayList] = useEvent([
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

    const toggleComments = useCallback(() => showComments((prev) => !prev), [])

    const handleAddToFavorites = () => {
        handleAddToFavButtonClicked(track!.id)
    }

    const needToShow = isCurrentTrack && mediaStatus !== MEDIA_STATUS.STOPPED

    return (
        <div
            className="relative  flex flex-col overflow-hidden shadow-sm"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
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
                {hovered && (
                    <Actions
                        isFavorite={isFavorite}
                        track={track}
                        toggleComments={toggleComments}
                        addToFavorites={handleAddToFavorites}
                    />
                )}
            </div>
            <Comments opened={comments} comments={track.comments} />
        </div>
    )
})

TrackListItem.displayName = "TrackListItem"

export const Tracklist = () => {
    const currentTrack = useStore(winamp.$currentTrack)
    const countSongs = selectors.useCountSongs()

    return (
        <div className="flex  flex-col divide-y-2 divide-gray-200">
            {useList($songs, {
                keys: [currentTrack, countSongs],
                fn: (song) => (
                    <TrackListItem track={song} isCurrentTrack={currentTrack?.id === song.id} />
                ),
            })}
        </div>
    )
}
