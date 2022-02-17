import clsx from "clsx"
import { useEvent, useStore } from "effector-react"
import { progress, winamp } from "@/features/media/winamp"

import { TIME_MODE } from "@/features/music/types"
import CharacterString from "../CharacterStrings/CharacterString"

interface MiniTimerProps {}

const MiniTimer = () => {
    const playerState = useStore(winamp.$mediaStatus)
    const timeMode = useStore(winamp.$timeMode)

    const timer = useStore(progress.$timer)

    const { firstSecond, lastSecond, firstMinute, lastMinute } = timer
    const handleSwitchTimeMode = useEvent(winamp.toggleTimeMode)

    return (
        <div
            className={clsx(
                playerState === "PAUSED" && "animate-w-blink",
                playerState === "STOPPED" && "hidden",

                "align-text-center absolute top-[22.5px]  left-[66px] flex h-2.5 "
            )}
            onClick={handleSwitchTimeMode}
        >
            <CharacterString>{timeMode === TIME_MODE.REMAINING ? "-" : " "}</CharacterString>
            <CharacterString className="ml-[1px] h-[6px] w-[5px]">{firstMinute}</CharacterString>
            <CharacterString className="ml-[1px] h-[6px] w-[5px]">{lastMinute}</CharacterString>
            <CharacterString className="ml-[3px] h-[6px] w-[5px]">{firstSecond}</CharacterString>
            <CharacterString className="ml-[1px] h-[6px] w-[5px]">{lastSecond}</CharacterString>
        </div>
    )
}

export default MiniTimer
