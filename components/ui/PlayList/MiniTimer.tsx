import { progress, winamp } from "@/features/media/winamp"
import { player } from "@/features/music/player"
import { EPLAYER_STATE, TIME_MODE } from "@/features/music/types"
import { FONT_LOOKUP } from "@/types"
import clsx from "clsx"
import { useEvent, useStore } from "effector-react"
import React, { memo, FC, useState, useEffect } from "react"

import CharacterString from "../CharacterStrings/CharacterString"

interface MiniTimerProps {}

const MiniTimer: FC<MiniTimerProps> = () => {
    const playerState = useStore(winamp.$mediaStatus)
    const timeMode = useStore(winamp.$timeMode)

    const timer = useStore(progress.$timer)

    const { firstSecond, lastSecond, firstMinute, lastMinute } = timer
    const handleSwitchTimeMode = useEvent(player.switchTimeMode)

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
            <CharacterString children={firstMinute} className=" ml-[1px] h-[6px] w-[5px]" />
            <CharacterString children={lastMinute} className=" ml-[1px] h-[6px] w-[5px]" />
            <CharacterString children={firstSecond} className=" ml-[3px] h-[6px] w-[5px]" />
            <CharacterString children={lastSecond} className=" ml-[1px] h-[6px] w-[5px]" />
        </div>
    )
}

export default memo(MiniTimer)
