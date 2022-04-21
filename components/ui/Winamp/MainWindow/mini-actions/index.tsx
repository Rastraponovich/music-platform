import { winamp, winampControls } from "@/features/media/winamp"
import { useEvent, useStore } from "effector-react"
import { memo } from "react"
import WinampButton from "../../WinampButton"

interface MiniActionsProps {
    bottom?: boolean
}

const MiniActions = ({ bottom = false }: MiniActionsProps) => {
    const handleMinimize = () => {}
    const playing = useStore(winamp.$mediaStatus)

    const [handlePlay, handlePause, handlePrevTrackClick, handleNextTrackClick, handleStopClick] =
        useEvent([
            winampControls.play,
            winampControls.pause,
            winampControls.toggleLoop,
            winampControls.toggleShuffle,
            winampControls.prevTrack,
            winampControls.nextTrack,
            winampControls.stop,
        ])
    return (
        <div className="flex items-center">
            <WinampButton
                id="previous"
                title="Previous Track"
                onClick={handlePrevTrackClick}
                className="h-2.5 w-2.5 cursor-winamp"
            />
            <WinampButton
                id="play"
                title="Play"
                onClick={handlePlay}
                className="h-2.5 w-2.5 cursor-winamp"
            />
            <WinampButton
                id="pause"
                title="Pause"
                onClick={() => (playing === "PLAYING" ? handlePause() : handlePlay())}
                className="h-2.5 w-2.5 cursor-winamp"
            />
            <WinampButton
                id="stop"
                title="Stop"
                onClick={handleStopClick}
                className="h-2.5 w-2.5 cursor-winamp"
            />
            <WinampButton
                id="next"
                title="Next Track"
                onClick={handleNextTrackClick}
                className="h-2.5 w-2.5 cursor-winamp"
            />
            <WinampButton
                id="next"
                title="Open File(s)"
                className="mr-[1px] h-2.5 w-2.5 cursor-winamp"
                onClick={handleMinimize}
            />

            {!bottom && <div id="position" className="mr-0.5 h-[7px] w-[17px]"></div>}
        </div>
    )
}

export default memo(MiniActions)
