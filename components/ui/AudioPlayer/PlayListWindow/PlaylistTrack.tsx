import { playlist } from "@/features/media/winamp"
import { Song } from "@/features/music/types"
import { Nullable } from "@/types"
import clsx from "clsx"
import { useStore, useEvent } from "effector-react"
import React, { memo, FC, useMemo, useState } from "react"

interface PlaylistTrackProps {
    track: Song
    index: number
    setSelectedTrack: (id: number) => void
    selectedTrack: Nullable<number>
}

const PlaylistTrack: FC<PlaylistTrackProps> = ({
    track,
    index,
    setSelectedTrack,
    selectedTrack,
}) => {
    const currentIndex = useStore(playlist.$currentPlayedTrackIndexPlaylist)
    const handleSelectNewTrack = useEvent(playlist.doubleClick)

    const firstMinute = useMemo(() => Math.floor(track.metaData.format.duration / 60), [track])
    const lastMinute = useMemo(() => Math.floor(track.metaData.format.duration % 60), [track])
    const seconds = useMemo(() => Math.floor(track.metaData.format.duration % 60), [track])

    return (
        <div
            onClick={() => setSelectedTrack(index)}
            onDoubleClick={() => handleSelectNewTrack(index)}
            // onKeyPress={(e) => useEscapeFn(e)}
            // onKeyDown={(e) => useEscapeFn(e)}
            className={clsx(
                "flex select-none justify-between px-1 text-[9px]",
                selectedTrack === index && "bg-[#0000C6]",
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
