import Link from "next/link"

import {
    LoopButton,
    NextTrackButton,
    OpenFileButton,
    PauseButton,
    PlayButton,
    PrevTrackButton,
    ShuffleButton,
    StopButton,
    ToggleEQButton,
    TogglePlaylistButton,
} from "./buttons"

export const Controls = () => {
    return (
        <div className="actions flex items-center pl-4">
            <PrevTrackButton />
            <PlayButton />
            <PauseButton />
            <StopButton />
            <NextTrackButton />
            <OpenFileButton />

            <div className="shuffle-repeat flex w-[75px] cursor-winamp items-center">
                <ShuffleButton />
                <LoopButton />
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

export const WindowControls = () => {
    return (
        <div className="windows">
            <ToggleEQButton />
            <TogglePlaylistButton />
        </div>
    )
}
