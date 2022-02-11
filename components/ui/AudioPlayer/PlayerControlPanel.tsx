import { player } from "@/features/music/player"
import clsx from "clsx"
import { useEvent, useStore } from "effector-react"
import Link from "next/link"
import React, { memo, FC } from "react"
import ActionsButton from "./ActionsButton"

interface PlayerControlPanelProps {}

const PlayerControlPanel: FC<PlayerControlPanelProps> = () => {
    const playing = useStore(player.$playing)
    const loop = useStore(player.$loop)
    const [
        handlePlay,
        handlePause,
        handleSetLoop,
        handlePrevTrackClick,
        handleNextTrackClick,
        handleStopClick,
    ] = useEvent([
        player.controls.controlPanelPlayClicked,
        player.controls.onPauseClicked,
        player.onSetLoopEnabled,
        player.controls.prevTrackClicked,
        player.controls.nextTrackClicked,
        player.controls.onStopButtonClicked,
    ])

    return (
        <div className="actions flex items-center pl-4">
            <ActionsButton id="previous" title="Previous Track" onClick={handlePrevTrackClick} />
            <ActionsButton id="play" title="Play" onClick={handlePlay} />
            <ActionsButton
                id="pause"
                title="Pause"
                onClick={() => (playing ? handlePause() : handlePlay())}
            />
            <ActionsButton id="stop" title="Stop" onClick={handleStopClick} />
            <ActionsButton id="next" title="Next Track" onClick={handleNextTrackClick} />
            <ActionsButton id="eject" title="Open File(s)" className="mx-1.5" />

            <div className="shuffle-repeat flex w-[75px] cursor-winamp items-center">
                <ActionsButton id="shuffle" className="" title="Toggle Shuffle" />
                <ActionsButton
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

export default PlayerControlPanel