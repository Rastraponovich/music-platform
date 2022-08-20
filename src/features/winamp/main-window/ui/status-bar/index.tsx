import clsx from "clsx"
import dynamic from "next/dynamic"
import { useEvent, useStore } from "effector-react"
import { $clutterBar, changeClutterBar } from "@/features/media/winamp"

import { progress, winamp } from "@/features/media/winamp"
import { TIME_MODE } from "@/features/music/types"
import { memo } from "react"
import { PLAYER_STATES } from "../../lib"
//@ts-ignore
const Visualizer = dynamic(() => import("../visualizer").then((mod) => mod.Visualizer), {
    ssr: false,
})

export const StatusBar = () => {
    const playerState = useStore(winamp.$mediaStatus)

    return (
        <div className="webamp-status flex h-[42px] w-[93px]">
            <ClutterBar />
            <div
                id="play-pause"
                className={clsx(
                    PLAYER_STATES[playerState],
                    "ml-[8px] mt-[6px] h-[9px] w-[9px] bg-no-repeat"
                )}
            ></div>
            <div id="work-indicator" className=""></div>
            <TimerDisplay />
            <Visualizer />
        </div>
    )
}

const TimerDisplay = () => {
    const timer = useStore(progress.$timer)
    const playerState = useStore(winamp.$mediaStatus)
    const timeMode = useStore(winamp.$timeMode)
    const { firstSecond, lastSecond, firstMinute, lastMinute } = timer
    const handleSwitchTimeModeClicked = useEvent(winamp.toggleTimeMode)

    return (
        <div
            id="time"
            className={clsx(
                "player-countdown",
                playerState === "PAUSED" && "animate-w-blink",
                playerState === "STOPPED" && "hidden",

                "ml-[6px] flex h-5 w-[66px] items-center"
            )}
            onClick={handleSwitchTimeModeClicked}
        >
            <Digit
                value={undefined}
                id="minus-sign"
                className={clsx("h-[1px] w-[5px]", timeMode === TIME_MODE.ELAPSED && "opacity-0")}
            />
            <Digit id="minute-first-digit" value={firstMinute} className="digit ml-[3px]" />
            <Digit id="minute-second-digit" value={lastMinute} className="digit ml-[3px]" />
            <Digit id="second-first-digit" value={firstSecond} className="digit ml-[9px]" />
            <Digit id="second-second-digit" value={lastSecond} className="digit ml-[3px]" />
        </div>
    )
}

interface DigitProps {
    value: number | undefined
    className: string
    id: string
}

const Digit = memo(({ id, value, className }: DigitProps) => {
    return (
        <span
            id={id}
            className={clsx(className, value !== undefined ? `digit-${value}` : null)}
        ></span>
    )
})

Digit.displayName = "Digit"

const ClutterBar = () => {
    const clutterBar = useStore($clutterBar)
    const handleChangeClutterBar = useEvent(changeClutterBar)

    return (
        <div id="clutter-bar" className="flex h-[43px] w-2 flex-col justify-start pt-[2px]">
            <div>
                <div className="handle h-full w-full">
                    <div
                        id="button-o"
                        onClick={() => handleChangeClutterBar("o")}
                        className={clsx(clutterBar.o && "selected", "h-2 w-2")}
                    ></div>
                </div>
            </div>
            <div
                id="button-a"
                onClick={() => handleChangeClutterBar("a")}
                className={clsx(clutterBar.a && "selected", "h-2 w-2")}
            ></div>
            <div
                id="button-i"
                onClick={() => handleChangeClutterBar("i")}
                className={clsx(clutterBar.i && "selected", "h-2 w-2")}
            ></div>
            <div
                title="Toggle Doublesize Mode"
                id="button-d"
                className={clsx(clutterBar.d && "selected", "h-2 w-2")}
                onClick={() => handleChangeClutterBar("d")}
            ></div>
            <div
                id="button-v"
                onClick={() => handleChangeClutterBar("v")}
                className={clsx(clutterBar.v && "selected", "h-2 w-2")}
            ></div>
        </div>
    )
}
