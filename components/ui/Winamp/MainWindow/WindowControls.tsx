import { useEvent, useStore } from "effector-react"

import { eq, playlist } from "@/features/media/winamp"

import { WinampButton } from "@/src/shared/ui/winamp/winamp-button"

interface WindowControlsProps {}

const WindowControls = () => {
    const visiblePlaylist = useStore(playlist.$visiblePlaylist)
    const setVisiblePlaylist = useEvent(playlist.toggleVisiblePlaylist)
    const toggleEQ = useEvent(eq.toggleVisibleEQ)
    const visibleEQ = useStore(eq.$visibleEQ)

    return (
        <div className="windows">
            <WinampButton
                id="equalizer-button"
                title="Toggle Graphical Equalizer"
                onClick={toggleEQ}
                active={visibleEQ}
            />
            <WinampButton
                id="playlist-button"
                title="Toggle Playlist Editor"
                active={visiblePlaylist}
                onClick={setVisiblePlaylist}
            />
        </div>
    )
}

export default WindowControls
