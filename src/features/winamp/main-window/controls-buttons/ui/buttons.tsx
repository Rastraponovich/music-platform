import { winamp, winampControls } from "@/features/media/winamp"
import { WinampButton } from "@/src/shared/ui/winamp/winamp-button"
import clsx from "clsx"
import { useEvent, useStore } from "effector-react"

export const PrevTrackButton = () => {
    const handlePrevTrackButtonClicked = useEvent(winampControls.prevTrack)
    return (
        <WinampButton id="previous" title="Previous Track" onClick={handlePrevTrackButtonClicked} />
    )
}

export const PlayButton = () => {
    const handlePlayButtonClicked = useEvent(winampControls.play)
    return <WinampButton id="play" title="Play" onClick={handlePlayButtonClicked} />
}

export const PauseButton = () => {
    const playing = useStore(winamp.$mediaStatus)

    const handlePauseButtonClicked = useEvent(winampControls.pause)
    const handlePlayButtonClicked = useEvent(winampControls.play)

    return (
        <WinampButton
            id="pause"
            title="Pause"
            onClick={() =>
                playing === "PLAYING" ? handlePauseButtonClicked() : handlePlayButtonClicked()
            }
        />
    )
}

export const StopButton = () => {
    const handleStopButtonClicked = useEvent(winampControls.stop)
    return <WinampButton id="stop" title="Stop" onClick={handleStopButtonClicked} />
}

export const NextTrackButton = () => {
    const handleNextTrackButtonClicked = useEvent(winampControls.nextTrack)
    return <WinampButton id="next" title="Next Track" onClick={handleNextTrackButtonClicked} />
}

export const OpenFileButton = () => {
    return <WinampButton id="eject" title="Open File(s)" className="mx-1.5" />
}

export const LoopButton = () => {
    const handleSetLoopButtonClicked = useEvent(winampControls.toggleLoop)
    const loop = useStore(winamp.$loop)

    return (
        <WinampButton
            id="repeat"
            className={clsx(loop && "selected")}
            title="Toggle Repeat"
            onClick={handleSetLoopButtonClicked}
        />
    )
}

export const ShuffleButton = () => {
    const handleSetShuffleButtonClicked = useEvent(winampControls.toggleShuffle)
    const shuffle = useStore(winamp.$shuffle)
    return (
        <WinampButton
            id="shuffle"
            className={clsx(shuffle && "selected")}
            title="Toggle Shuffle"
            onClick={handleSetShuffleButtonClicked}
        />
    )
}
