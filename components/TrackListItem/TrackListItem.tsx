import Image from "next/image"
import { useStore } from "effector-react"
import { memo, FC, useState } from "react"

import { useEvent } from "effector-react/scope"

import { player } from "@/features/music/player"

import { Song } from "@/features/music/types"

import TrackTimer from "./TrackTimer"
import PlayIcon from "../ui/icons/PlayIcon/PlayIcon"
import PlusIcon from "../ui/icons/PlusIcon/PlusIcon"
import MinusIcon from "../ui/icons/MinusIcon/MinusIcon"
import PauseIcon from "../ui/icons/PauseIcon/PauseIcon"
import Progressbar from "../ui/Progressbar/Progressbar"
import Annotation from "../ui/icons/Annotation/Annotation"

interface TrackListItemProps {
    track: Song
    isCurrentTrack: boolean
}

const TrackListItem: FC<TrackListItemProps> = ({ track, isCurrentTrack }) => {
    console.log("render track", track.name)
    const playingState = useStore(player.$playing)

    const [
        handleSelectTrack,
        handlePlay,
        handlePause,
        handleAddToPlayList,
        hanldeRemoveFromPlayList,
    ] = useEvent([
        player.selectTrack,
        player.controls.onPlayClicked,
        player.controls.onPauseClicked,
        player.playList.onAddToPlayList,
        player.playList.onRemoveFromPlayList,
    ])

    const play = () => {
        if (!isCurrentTrack) return handleSelectTrack(track)
        if (playingState) return handlePause()
        return handlePlay()
    }

    const isExistInPlaylist = useStore(player.playList.$playList).some(
        (item) => item.id === track.id
    )

    const handlePlayListActionClick = () => {
        if (isExistInPlaylist) return hanldeRemoveFromPlayList(track)

        return handleAddToPlayList(track)
    }
    const [comments, showComments] = useState(false)
    return (
        <div className="flex  flex-col">
            <div className="grid grid-cols-12 items-center rounded bg-white py-2 shadow-sm">
                <button onClick={play} className="col-span-1 justify-self-center">
                    {isCurrentTrack ? (
                        playingState ? (
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
                        {isCurrentTrack && <Progressbar />}
                    </div>
                </div>
                <TrackTimer isCurrentTrack={isCurrentTrack} metaData={track.metaData} />

                <div className="col-span-2 col-end-13 flex space-x-2 justify-self-start">
                    <button onClick={handlePlayListActionClick}>
                        {!isExistInPlaylist ? (
                            <PlusIcon size="small" />
                        ) : (
                            <MinusIcon size="small" />
                        )}
                    </button>
                    <button onClick={() => showComments(!comments)}>
                        <Annotation size="small" />
                    </button>
                </div>
                {isCurrentTrack && comments && (
                    <div className="col-span-12 bg-gray-600 p-10">asdsads</div>
                )}
            </div>
        </div>
    )
}

export default memo(TrackListItem)
