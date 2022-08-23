import clsx from "clsx"
import dynamic from "next/dynamic"
import { useEvent } from "effector-react"
import { $clutterBar, changeClutterBar } from "@/features/media/winamp"

import { TIME_MODE } from "@/features/music/types"
import { memo } from "react"
import { PLAYER_STATES } from "../../lib"
import { toggleTimeModeButtonClicked } from "../../model"
import { useClutterBar, usePlayerState, useTimeMode, useTimer } from "../../model/selectors"
import { changedClutterBar } from "../../model/clutter-bar"
//@ts-ignore
const Visualizer = dynamic(() => import("../visualizer").then((mod) => mod.Visualizer), {
    ssr: false,
})

export const StatusBar = () => {
    const playerState = usePlayerState()

    return (
        <div className="webamp-status flex h-[42px] w-[93px]">
            <ClutterBar />
            <span
                id="play-pause"
                className={clsx(
                    PLAYER_STATES[playerState],
                    "cursor-winamp",
                    "ml-[8px] mt-[6px] h-[9px] w-[9px] bg-no-repeat"
                )}
            />
            <span id="work-indicator" className=""></span>
            <TimerDisplay />
            <Visualizer />
        </div>
    )
}

const TimerDisplay = () => {
    const { firstSecond, lastSecond, firstMinute, lastMinute } = useTimer()
    const playerState = usePlayerState()
    const timeMode = useTimeMode()
    const handleSwitchTimeModeClicked = useEvent(toggleTimeModeButtonClicked)

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

const Digit = memo(({ id, value, className }: DigitProps) => (
    <span id={id} className={clsx(className, value !== undefined ? `digit-${value}` : null)} />
))

Digit.displayName = "Digit"

const ClutterBar = () => {
    const clutterBar = useClutterBar()
    const handleChangedClutterBar = useEvent(changedClutterBar)

    return (
        <div id="clutter-bar" className="flex h-[43px] w-2 flex-col justify-start pt-[2px]">
            <div>
                <div className="handle h-full w-full">
                    <ClutterBarButton
                        id="o"
                        onClick={handleChangedClutterBar}
                        pressed={clutterBar.o}
                    />
                </div>
            </div>
            <ClutterBarButton id="a" onClick={handleChangedClutterBar} pressed={clutterBar.a} />
            <ClutterBarButton id="i" onClick={handleChangedClutterBar} pressed={clutterBar.i} />
            <ClutterBarButton
                id="d"
                onClick={handleChangedClutterBar}
                pressed={clutterBar.d}
                title="Toggle Doublesize Mode"
            />
            <ClutterBarButton id="v" onClick={handleChangedClutterBar} pressed={clutterBar.v} />
        </div>
    )
}

interface ClutterBarButtonProps {
    id: string
    onClick(id: string): void
    pressed: boolean
    title?: string
}

const ClutterBarButton = memo(({ onClick, id, pressed, title }: ClutterBarButtonProps) => {
    const handleButtonClicked = () => onClick(id)

    return (
        <span
            title={title}
            id={`button-${id}`}
            onClick={handleButtonClicked}
            className={clsx(pressed && "selected", "h-2 w-2")}
        />
    )
})

ClutterBarButton.displayName = "ClutterBarButton"
