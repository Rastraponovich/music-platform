import { progress, winamp } from "@/features/media/winamp"
import { player } from "@/features/music/player"
import { EPLAYER_STATE, TIME_MODE } from "@/features/music/types"
import clsx from "clsx"
import { useEvent, useStore } from "effector-react"
import dynamic from "next/dynamic"
import React, { FC } from "react"

const Visualizer = dynamic(() => import("./Visualizer"), { ssr: false })

interface StatusBarProps {}

const StatusBar: FC<StatusBarProps> = () => {
    const playerState = useStore(winamp.$mediaStatus)
    const timeMode = useStore(winamp.$timeMode)

    const timer = useStore(progress.$timer)

    const { firstSecond, lastSecond, firstMinute, lastMinute } = timer

    const handleSwitchTimeMode = useEvent(winamp.toggleTimeMode)

    return (
        <div className="webamp-status flex h-[42px] w-[93px]">
            <div id="clutter-bar" className="h-[43px] w-2">
                <div>
                    <div className="handle h-full w-full">
                        <div id="button-o"></div>
                    </div>
                </div>
                <div id="button-a"></div>
                <div id="button-i"></div>
                <div title="Toggle Doublesize Mode" id="button-d" className=""></div>
                <div id="button-v"></div>
            </div>
            <div
                id="play-pause"
                className={clsx(
                    // playing ? "play" : "pause",
                    playerState === "PLAYING" && "play",
                    playerState === "PAUSED" && "pause",
                    playerState === "STOPPED" && "stop",

                    "ml-[8px] mt-[6px] h-[9px] w-[9px] bg-no-repeat"
                )}
            ></div>
            <div id="work-indicator" className=""></div>
            <div
                id="time"
                className={clsx(
                    "player-countdown",
                    playerState === "PAUSED" && "animate-w-blink",
                    playerState === "STOPPED" && "hidden",

                    "ml-[6px] flex h-5 w-[66px] items-center"
                )}
                onClick={handleSwitchTimeMode}
            >
                <span
                    id="minus-sign"
                    className={clsx(
                        " h-[1px] w-[5px]",
                        timeMode === TIME_MODE.ELAPSED && "opacity-0"
                    )}
                />
                <span
                    id="minute-first-digit"
                    className={clsx("digit ml-[3px]", `digit-${firstMinute}`)}
                ></span>
                <span
                    id="minute-second-digit"
                    className={clsx("digit ml-[3px]", `digit-${lastMinute}`)}
                ></span>
                <span
                    id="second-first-digit"
                    className={clsx("digit ml-[9px]", `digit-${firstSecond}`)}
                ></span>
                <span
                    id="second-second-digit"
                    className={clsx("digit ml-[3px]", `digit-${lastSecond}`)}
                ></span>
            </div>
            <Visualizer />
        </div>
    )
}

export default StatusBar
