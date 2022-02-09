import { player } from "@/features/music/player"
import clsx from "clsx"
import { useStore, useEvent } from "effector-react"
import React, { memo, FC, useState, MouseEvent } from "react"
import Progressbar from "../ui/Progressbar/Progressbar"

import dynamic from "next/dynamic"

const AudioPlayer = dynamic(() => import("../ui/AudioPlayer/AudioPlayer"), { ssr: false })

interface AsidePlayerProps {}

const AsidePlayer: FC<AsidePlayerProps> = () => {
    console.log("render asidePlayer")
    const currentTrack = useStore(player.$currentTrack)
    const hidden = useStore(player.$compact)
    const handleSetCompact = useEvent(player.onSetCompact)

    const playing = useStore(player.$playing)

    const [pos, setpos] = useState<{ [key: string]: number | string }>({
        clientX: "unset",
        clientY: 0,
        bottom: "1rem",
    })

    const [diff, setDiff] = useState({
        diffX: 0,
        diffY: 0,
    })

    const [allowDragging, setAllowDragging] = useState<boolean>(false)

    const handleDragStart = (e: MouseEvent<HTMLElement>) => {
        e.preventDefault()
        setDiff({
            diffX: e.screenX - e.currentTarget.getBoundingClientRect().left,
            diffY: e.screenY - e.currentTarget.getBoundingClientRect().top,
        })
        setpos({ ...pos, bottom: "unset" })
        setAllowDragging(true)
    }
    const handleDragging = (e: MouseEvent<HTMLElement>) => {
        if (allowDragging) {
            const left = e.screenX - diff.diffX
            const top = e.screenY - diff.diffY

            setpos({ ...pos, clientX: left, clientY: top })
        }
    }
    const handleDragEnd = (e: MouseEvent<HTMLElement>) => setAllowDragging(false)
    const [selected, setSelected] = useState(false)
    return (
        <aside
        id='main-window'
            className={clsx(
                "fixed z-50  rounded bg-white  shadow-md",
                hidden && "max-h-8 overflow-hidden",
                "w-[80%]",
                !currentTrack && "hidden"
            )}
            style={{ top: pos.clientY, left: pos.clientX, bottom: pos.bottom }}
        >
            <div
                className="-mx-10 flex flex-row-reverse"
                onMouseDown={handleDragStart}
                onMouseMove={handleDragging}
                onMouseUp={handleDragEnd}
            >
                <button className=" bg-green-600 " onClick={handleSetCompact}>
                    {!hidden ? "hide" : "show"}
                </button>
            </div>

            {/* titlebar */}
            <div
                className={clsx("draggable title-bar flex", selected && "selected")}
                onClick={() => setSelected((prev) => !prev)}
            >
                <div id="option-context">
                    <div className="h-full w-full">
                        <div id="option" title="Winamp Menu"></div>
                    </div>
                </div>
                <button
                    id="minimize"
                    title="Minimize"
                    className=""
                    onClick={() => handleSetCompact()}
                ></button>
                <button
                    id="shade"
                    title="Toggle Windowshade Mode"
                    className=""
                    onClick={() => handleSetCompact()}
                ></button>
                <button
                    id="close"
                    title="Close"
                    className=""
                    onClick={() => handleSetCompact()}
                ></button>
            </div>
            {/* statusbar */}
            <div className="webamp-status">
                <div id="clutter-bar">
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
                <div id="play-pause" className={clsx(playing ? "play" : "pause")}></div>
                <div id="work-indicator" className=""></div>
                <div id="time" className="player-countdown">
                    <div id="minute-first-digit" className="digit digit-0"></div>
                    <div id="minute-second-digit" className="digit digit-0"></div>
                    <div id="second-first-digit" className="digit digit-0"></div>
                    <div id="second-second-digit" className="digit digit-2"></div>
                </div>
            </div>
            <canvas id="visualizer" width="152" height="32" className="h-4 w-[76px]"></canvas>
            {currentTrack && <AudioPlayer className={clsx(hidden && "hidden", "select-none")} />}

            {hidden && <Progressbar className="w-full max-w-[calc(100%-2rem)]" />}
        </aside>
    )
}

export default memo(AsidePlayer)
