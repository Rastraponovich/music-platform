import clsx from "clsx"
import Link from "next/link"
import { useEvent, useStore } from "effector-react"

import { winamp, winampControls } from "@/features/media/winamp"

import WinampButton from "../WinampButton"

const Controls = () => {
    const playing = useStore(winamp.$mediaStatus)
    const loop = useStore(winamp.$loop)
    const shuffle = useStore(winamp.$shuffle)
    const [
        handlePlay,
        handlePause,
        handleSetLoop,
        handleSetShuffle,
        handlePrevTrackClick,
        handleNextTrackClick,
        handleStopClick,
    ] = useEvent([
        winampControls.play,
        winampControls.pause,
        winampControls.toggleLoop,
        winampControls.toggleShuffle,
        winampControls.prevTrack,
        winampControls.nextTrack,
        winampControls.stop,
    ])

    return (
        <div className="actions flex items-center pl-4">
            <WinampButton id="previous" title="Previous Track" onClick={handlePrevTrackClick} />
            <WinampButton id="play" title="Play" onClick={handlePlay} />
            <WinampButton
                id="pause"
                title="Pause"
                onClick={() => (playing === "PLAYING" ? handlePause() : handlePlay())}
            />
            <WinampButton id="stop" title="Stop" onClick={handleStopClick} />
            <WinampButton id="next" title="Next Track" onClick={handleNextTrackClick} />
            <WinampButton id="eject" title="Open File(s)" className="mx-1.5" />

            <div className="shuffle-repeat flex w-[75px] cursor-winamp items-center">
                <WinampButton
                    id="shuffle"
                    className={clsx(shuffle && "selected")}
                    title="Toggle Shuffle"
                    onClick={handleSetShuffle}
                />
                <WinampButton
                    id="repeat"
                    className={clsx(loop && "selected")}
                    title="Toggle Repeat"
                    onClick={handleSetLoop}
                />
            </div>
            <Link href="https://webamp.org/about">
                <a
                    id="about"
                    target="_blank"
                    title="About"
                    className="ml-[13px] h-[15px] w-[13px] cursor-pointer"
                ></a>
            </Link>
        </div>
    )
}

export default Controls
