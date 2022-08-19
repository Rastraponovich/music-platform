import { winampControls } from "@/features/media/winamp"
import { WinampButton } from "@/src/shared/ui/winamp/winamp-button"
import { useEvent } from "effector-react"
import { selectors } from "../model"

const DEFAULT_MINI_ACTION_BUTTON_STYLE = `h-2.5 w-2.5 cursor-winamp`

export const OpenFileButton = () => {
    const handleOpenFileButtonClicked = () => {}
    return (
        <WinampButton
            id="next"
            title="Open File(s)"
            className={`mr-[1px] ${DEFAULT_MINI_ACTION_BUTTON_STYLE}`}
            onClick={handleOpenFileButtonClicked}
        />
    )
}

export const NextTrackButton = () => {
    const handleNextTrackButtonClicked = useEvent(winampControls.nextTrack)
    return (
        <WinampButton
            id="next"
            title="Next Track"
            onClick={handleNextTrackButtonClicked}
            className={DEFAULT_MINI_ACTION_BUTTON_STYLE}
        />
    )
}

export const StopButton = () => {
    const handleStopButtonClicked = useEvent(winampControls.stop)
    return (
        <WinampButton
            id="stop"
            title="Stop"
            onClick={handleStopButtonClicked}
            className={DEFAULT_MINI_ACTION_BUTTON_STYLE}
        />
    )
}

export const PauseButton = () => {
    const handlePlayButtonClicked = useEvent(winampControls.play)
    const handlePauseButtonClicked = useEvent(winampControls.pause)
    const playing = selectors.useIsPlaying()
    return (
        <WinampButton
            id="pause"
            title="Pause"
            onClick={() =>
                playing === "PLAYING" ? handlePauseButtonClicked() : handlePlayButtonClicked()
            }
            className={DEFAULT_MINI_ACTION_BUTTON_STYLE}
        />
    )
}

export const PlayButton = () => {
    const handlePlayButtonClicked = useEvent(winampControls.play)
    return (
        <WinampButton
            id="play"
            title="Play"
            onClick={handlePlayButtonClicked}
            className={DEFAULT_MINI_ACTION_BUTTON_STYLE}
        />
    )
}
export const PrevButton = () => {
    const handlePrevTrackClicked = useEvent(winampControls.prevTrack)
    return (
        <WinampButton
            id="previous"
            title="Previous Track"
            onClick={handlePrevTrackClicked}
            className={DEFAULT_MINI_ACTION_BUTTON_STYLE}
        />
    )
}
