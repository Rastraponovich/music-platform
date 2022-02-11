import { player } from "@/features/music/player"
import { EPLAYER_STATE, TIME_MODE } from "@/features/music/types"
import { FONT_LOOKUP } from "@/types"
import clsx from "clsx"
import { useEvent, useStore } from "effector-react"
import React, { memo, FC, useState, useEffect } from "react"

import CharacterString from "../CharacterStrings/CharacterString"

interface MiniTimerProps {}

const MiniTimer: FC<MiniTimerProps> = () => {
    const currentTime = useStore(player.progress.$currentTime)
    const playerState = useStore(player.$playerState)
    const timeMode = useStore(player.$timeMode)
    const timeremaining = useStore(player.progress.$timeRemaining)

    const handleSwitchTimeMode = useEvent(player.switchTimeMode)
    const [minutes, setMinutes] = useState(0)
    const [seconds, setSeconds] = useState(0)

    useEffect(() => {
        if (timeMode === TIME_MODE.ELAPSED) {
            if (currentTime < 60) {
                setSeconds(Math.ceil(currentTime))
            } else {
                setSeconds(Math.ceil(currentTime % 60))
                setMinutes(Math.floor(currentTime / 60))
            }
        } else {
            if (timeremaining < 60) {
                setSeconds(Math.ceil(timeremaining))
            } else {
                setSeconds(Math.ceil(timeremaining % 60))
                setMinutes(Math.floor(timeremaining / 60))
            }
        }

        return () => {
            setSeconds(0)
            setMinutes(0)
        }
    }, [currentTime, timeremaining, timeMode])

    return (
        <div
            className={clsx(
                playerState === EPLAYER_STATE.PAUSED && "animate-w-blink",
                playerState === EPLAYER_STATE.STOPED && "hidden",

                "align-text-center absolute top-[22.5px]  left-[66px] flex h-2.5 "
            )}
            onClick={handleSwitchTimeMode}
        >
            <CharacterString>{timeMode === TIME_MODE.REMAINING ? "-" : " "}</CharacterString>
            <CharacterString
                children={Math.floor(minutes / 10)}
                className=" ml-[1px] h-[6px] w-[5px]"
            />
            <CharacterString
                children={Math.floor(minutes % 10)}
                className=" ml-[1px] h-[6px] w-[5px]"
            />
            <CharacterString
                children={Math.floor(seconds / 10)}
                className=" ml-[3px] h-[6px] w-[5px]"
            />
            <CharacterString
                children={Math.floor(seconds % 10)}
                className=" ml-[1px] h-[6px] w-[5px]"
            />
        </div>
    )
}

export default memo(MiniTimer)
