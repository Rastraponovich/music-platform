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
    const currentIndex = useStore(playlist.$currentPlayedTrackIndexPlaylist)
    const highlightTrackInPlaylist = useStore(playlist.$selectedTrackInPlayList)
    const handleHighLightTrack = useEvent(playlist.highlightTrackInPlaylist)
    const handleSelectNewTrack = useEvent(playlist.doubleClick)

    const firstMinute = useMemo(() => Math.floor(track.metaData.format.duration / 60), [track])
    const lastMinute = useMemo(() => Math.floor(track.metaData.format.duration % 60), [track])
    const seconds = useMemo(() => Math.floor(track.metaData.format.duration % 60), [track])

    return (
        <div
            onClick={() => handleHighLightTrack(index)}
            onDoubleClick={() => handleSelectNewTrack(index)}
            // onKeyPress={(e) => useEscapeFn(e)}
            // onKeyDown={(e) => useEscapeFn(e)}
            className={clsx(
                "flex select-none justify-between px-1 text-[9px]",
                highlightTrackInPlaylist === index && "bg-[#0000C6]",
                currentIndex === index ? "text-white" : "text-[#00FF00] "
            )}
        >
            <span className="truncate">
                {index + 1}. {track.name}
            </span>
            <span>
                {firstMinute}:{lastMinute < 10 ? `0${lastMinute}` : seconds}
            </span>
        </div>
    )
}

export default memo(PlaylistTrack)
