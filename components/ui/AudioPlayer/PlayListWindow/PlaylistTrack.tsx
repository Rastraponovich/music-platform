import { playlist } from "@/features/media/winamp"
import { Song } from "@/features/music/types"
import clsx from "clsx"
import { useStore, useEvent } from "effector-react"
import React, { memo, FC, useMemo } from "react"

interface PlaylistTrackProps {
    track: Song
    index: number
}

const PlaylistTrack: FC<PlaylistTrackProps> = ({ track, index }) => {
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
