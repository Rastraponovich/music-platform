import { player } from "@/features/music/player"
import clsx from "clsx"
import { useStore, useEvent } from "effector-react"
import React, { memo, FC, useState, MouseEvent, useCallback } from "react"
import Progressbar from "../ui/Progressbar/Progressbar"

import dynamic from "next/dynamic"
import PlayList from "../ui/PlayList/PlayList"
import PlayerControlPanel from "../ui/AudioPlayer/PlayerControlPanel"
import Visualizer from "../ui/AudioPlayer/Visualizer"
import StatusBar from "../ui/AudioPlayer/StatusBar"
import TitleBar from "../ui/AudioPlayer/MainWindow/TitleBar"
import VolumeBar from "../ui/AudioPlayer/VolumeBar"
import BalanceBar from "../ui/AudioPlayer/BalanceBar"
import PlayerWindowsControlPanel from "../ui/AudioPlayer/PlayerWindowsControlPanel"
import MediaInfo from "../ui/AudioPlayer/MediaInfo/MediaInfo"

interface AsidePlayerProps {}

const AsidePlayer: FC<AsidePlayerProps> = () => {
    console.log("render asidePlayer")
    const currentTrack = useStore(player.$currentTrack)
    const hidden = useStore(player.$compact)

    const [pos, setpos] = useState<{ [key: string]: number | string }>({
        clientX: "1rem",
        clientY: "95px",
        bottom: "1rem",
    })

    const [diff, setDiff] = useState({
        diffX: 0,
        diffY: 0,
    })

    const [allowDragging, setAllowDragging] = useState<boolean>(false)

    const handleDragStart = useCallback(
        (e: MouseEvent<HTMLElement>) => {
            e.preventDefault()
            setDiff({
                diffX: e.screenX - e.currentTarget.getBoundingClientRect().left,
                diffY: e.screenY - e.currentTarget.getBoundingClientRect().top,
            })
            setpos({ ...pos, bottom: "unset" })
            setAllowDragging(true)
        },
        [allowDragging, diff, pos]
    )
    const handleDragging = useCallback(
        (e: MouseEvent<HTMLElement>) => {
            if (allowDragging) {
                const left = e.screenX - diff.diffX
                const top = e.screenY - diff.diffY

                if (e.pageX === 0) {
                    return setTimeout(() => {
                        setpos({ ...pos, clientX: 0 })
                    }, 500)
                }

                setpos({ ...pos, clientX: left, clientY: top })
            }
        },
        [allowDragging, pos]
    )
    const handleDragEnd = useCallback(
        (e: MouseEvent<HTMLElement>) => setAllowDragging(false),
        [allowDragging]
    )
    return (
        <aside
            id="main-window"
            className={clsx(
                "fixed z-50  flex h-[116px] max-h-[116px] cursor-winamp flex-col bg-transparent pb-[9px] shadow-md",
                hidden && " overflow-hidden",
                "w-[275px]",
                !currentTrack && "hidden"
            )}
            style={{ top: pos.clientY, left: pos.clientX, bottom: pos.bottom }}
        >
            <TitleBar
                onMouseDown={handleDragStart}
                onMouseMove={handleDragging}
                onMouseUp={handleDragEnd}
                onMouseLeave={handleDragEnd}
            />
            <div className="my-2 flex pr-2 pl-2.5">
                <StatusBar />

                {/* info */}
                <MediaInfo />
                {/* volume */}
                <VolumeBar />
                {/* balance */}
                <BalanceBar />
                {/* windows */}
                <PlayerWindowsControlPanel />
            </div>

            <Progressbar
                id="position"
                className="slider-thumb ml-4  mb-[7px] h-2.5 w-[248px] appearance-none bg-progresbar-player"
            />
            <PlayerControlPanel />

            {hidden && <Progressbar className="w-full max-w-[calc(100%-2rem)]" />}
        </aside>
    )
}

export default memo(AsidePlayer)
