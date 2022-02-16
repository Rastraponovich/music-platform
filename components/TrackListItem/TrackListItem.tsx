import Image from "next/image"
import { useStore } from "effector-react"
import { memo, FC, useState } from "react"

import { useEvent } from "effector-react/scope"

import { Song } from "@/features/music/types"

import TrackTimer from "./TrackTimer"
import PlayIcon from "../ui/icons/PlayIcon/PlayIcon"
import PlusIcon from "../ui/icons/PlusIcon/PlusIcon"
import PauseIcon from "../ui/icons/PauseIcon/PauseIcon"
import Progressbar from "../ui/Progressbar/Progressbar"
import Annotation from "../ui/icons/Annotation/Annotation"
import { playlist, winamp, winampControls } from "@/features/media/winamp"
import { MEDIA_STATUS } from "@/features/media/constants"

interface TrackListItemProps {
    track: Song
    isCurrentTrack: boolean
}

const TrackListItem: FC<TrackListItemProps> = ({ track, isCurrentTrack }) => {
    // console.log("render track", track.name)
    const mediaStatus = useStore(winamp.$mediaStatus)

    const firstMinute = Math.floor(track?.metaData?.format?.duration / 60)
    const lastMinute = Math.floor(track?.metaData.format?.duration % 60)
    const seconds = Math.floor(track?.metaData?.format?.duration % 60)

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
    return (
        <div className="flex  flex-col">
            <div className="grid grid-cols-12 items-center rounded bg-white py-2 shadow-sm">
                <button onClick={play} className="col-span-1 justify-self-center">
                    {isCurrentTrack ? (
                        mediaStatus === "PLAYING" ? (
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
                        {isCurrentTrack && mediaStatus !== MEDIA_STATUS.STOPPED && <Progressbar />}
                    </div>
                </div>
                <div className="col-span-1 col-start-10 mr-2 flex justify-self-end text-sm text-gray-800">
                    {isCurrentTrack && <TrackTimer />}

                    <span>
                        {firstMinute}:{lastMinute < 10 ? `0${lastMinute}` : seconds}
                    </span>
                </div>

                <div className="col-span-2 col-end-13 flex space-x-2 justify-self-start">
                    <button onClick={() => handleAddToPlayList(track)}>
                        <PlusIcon size="normal" />
                    </button>

                    <button onClick={() => showComments(!comments)} className="indicator  ">
                        <div className="indicator-item badge badge-sm z-10">
                            {track.comments.length}
                        </div>
                        <Annotation size="normal" />
                    </button>
                </div>
                {comments && <div className="col-span-12 bg-gray-600 p-10">asdsads</div>}
            </div>
        </div>
    )
}

export default memo(TrackListItem)
