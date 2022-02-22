import { playlist, winamp, winampStates } from "@/features/media/winamp"
import { useList, useStore } from "effector-react"
import PlaylistTrack from "./PlaylistTrack"

interface PlaylistProps {}

const DEFAULT_HEIGHT = 151

const Playlist = () => {
    const playlistLength = useStore(playlist.$playlistLength)
    const currentIndex = useStore(playlist.$currentPlayedTrackIndex)
    const playingState = useStore(winamp.$mediaStatus)
    const selectedTrack = useStore(playlist.$selectedTrackInPlayList)
    return (
        <div
            className={
                "flex  max-h-[151px] min-h-[150px] grow cursor-winamp scroll-px-4  flex-col overflow-y-auto bg-black py-1 shadow-lg"
            }
            style={{ height: DEFAULT_HEIGHT }}
        >
            {useList(playlist.$playlist, {
                keys: [playlistLength, currentIndex, playingState, selectedTrack],
                fn: (track, index) => <PlaylistTrack track={track} index={index} />,
            })}
        </div>
    )
}

export default Playlist
