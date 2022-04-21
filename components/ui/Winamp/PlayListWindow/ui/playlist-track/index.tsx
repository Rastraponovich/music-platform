import clsx from "clsx"
import React, { memo, useMemo } from "react"
import { useStore, useEvent } from "effector-react"

import { playlist } from "@/features/media/winamp"

import { Track } from "@/features/music/types"

interface PlaylistTrackProps {
    track: Track
    index: number
}

const PlaylistTrack = ({ track, index }: PlaylistTrackProps) => {
    const currentIndex = useStore(playlist.$currentPlayedTrackIndex)
    const selectedTrackInPlaylist = useStore(playlist.$selectedTrackInPlayList)
    const handleSelectTrackInPlaylist = useEvent(playlist.selectTrackInPlaylist)
    const handleSelectNewTrack = useEvent(playlist.doubleClick)

    const firstMinute = useMemo(() => Math.floor(track.metaData.format.duration / 60), [track])
    const lastMinute = useMemo(() => Math.floor(track.metaData.format.duration % 60), [track])
    const seconds = useMemo(() => Math.floor(track.metaData.format.duration % 60), [track])

    return (
        <div
            onClick={() => handleSelectTrackInPlaylist(index)}
            onDoubleClick={() => handleSelectNewTrack(index)}
            // onKeyPress={(e) => useEscapeFn(e)}
            // onKeyDown={(e) => useEscapeFn(e)}
            className={clsx(
                "flex h-[13px] max-h-[13px] min-h-[13px] select-none justify-between  px-1 text-[9px]",
                selectedTrackInPlaylist === index && "bg-[#0000C6]",
                currentIndex === index ? "text-white" : "text-[#00FF00] "
            )}
        >
            <span className="truncate">
                {index + 1}. {track.artist} - {track.name}
            </span>
            <span>
                {firstMinute}:{lastMinute < 10 ? `0${lastMinute}` : seconds}
            </span>
        </div>
    )
}

export default memo(PlaylistTrack)
