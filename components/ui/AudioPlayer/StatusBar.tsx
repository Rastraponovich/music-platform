import { player } from "@/features/music/player"
import { EPLAYER_STATE, TIME_MODE } from "@/features/music/types"
import clsx from "clsx"
import { useEvent, useStore } from "effector-react"
import React, { FC, useState, useEffect } from "react"

import Visualizer from "./Visualizer"

interface StatusBarProps {}

const StatusBar: FC<StatusBarProps> = () => {
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
    }, [currentTime, timeMode, timeremaining])

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

                    "ml-[8px] mt-[6px] h-[9px] w-[9px] bg-no-repeat"
                )}
            ></div>
            <div id="work-indicator" className=""></div>
            <div
                id="time"
                className={clsx(
                    "player-countdown",
                    playerState === EPLAYER_STATE.PAUSED && "animate-w-blink",
                    playerState === EPLAYER_STATE.STOPED && "hidden",

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
                    className={clsx("digit ml-[3px]", `digit-${Math.floor(minutes / 10)}`)}
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
