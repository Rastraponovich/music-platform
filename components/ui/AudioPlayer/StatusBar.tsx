import { player } from "@/features/music/player"
import { EPLAYER_STATE } from "@/features/music/types"
import clsx from "clsx"
import { useStore } from "effector-react"
import React, { FC, useState, useEffect } from "react"

import Visualizer from "./Visualizer"

interface StatusBarProps {}

const StatusBar: FC<StatusBarProps> = () => {
    const currentTime = useStore(player.progress.$currentTime)
    const playerState = useStore(player.$playerState)

    const [minutes, setMinutes] = useState(0)
    const [seconds, setSeconds] = useState(0)

    useEffect(() => {
        if (currentTime < 60) {
            setSeconds(Math.ceil(currentTime))
        } else {
            setSeconds(Math.ceil(currentTime % 60))
            setMinutes(Math.floor(currentTime / 60))
        }

        return () => {
            setSeconds(0)
            setMinutes(0)
        }
    }, [currentTime])

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
                    playerState === EPLAYER_STATE.PLAYED && "play",
                    playerState === EPLAYER_STATE.PAUSED && "pause",
                    playerState === EPLAYER_STATE.STOPED && "stop",

                    "ml-[9px] mt-[6px] h-[9px] w-[9px] bg-no-repeat"
                )}
            ></div>
            <div id="work-indicator" className=""></div>
            <div
                id="time"
                className={clsx(
                    "player-countdown",
                    playerState === EPLAYER_STATE.PAUSED && "animate-w-blink",
                    playerState === EPLAYER_STATE.STOPED && "hidden",

                    "ml-[13px] flex h-5 w-[59px] pt-1"
                )}
            >
                <span
                    id="minute-first-digit"
                    className={clsx("digit", `digit-${Math.floor(minutes / 10)}`)}
                ></span>
                <span
                    id="minute-second-digit"
                    className={clsx("digit ml-[3px]", `digit-${Math.floor(minutes % 10)}`)}
                ></span>
                <span
                    id="second-first-digit"
                    className={clsx("digit ml-[9px]", `digit-${Math.floor(seconds / 10)}`)}
                ></span>
                <span
                    id="second-second-digit"
                    className={clsx("digit ml-[3px]", `digit-${Math.floor(seconds % 10)}`)}
                ></span>
            </div>
            <Visualizer />
        </div>
    )
}

export default StatusBar
