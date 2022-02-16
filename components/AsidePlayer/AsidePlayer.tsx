import { player } from "@/features/music/player"
import clsx from "clsx"
import { useStore } from "effector-react"
import React, { memo, FC, useState, MouseEvent, useCallback } from "react"
import Progressbar from "../ui/Progressbar/Progressbar"

import PlayerControlPanel from "../ui/AudioPlayer/PlayerControlPanel"
import StatusBar from "../ui/AudioPlayer/StatusBar"
import TitleBar from "../ui/AudioPlayer/MainWindow/TitleBar"
import VolumeBar from "../ui/AudioPlayer/VolumeBar"
import BalanceBar from "../ui/AudioPlayer/BalanceBar"
import PlayerWindowsControlPanel from "../ui/AudioPlayer/PlayerWindowsControlPanel"
import MediaInfo from "../ui/AudioPlayer/MediaInfo/MediaInfo"
import { winampStates } from "@/features/media/winamp"
import { useChangeCurentTime } from "@/hooks/useChangeCurrentTime"
import { WINAMP_STATE } from "@/features/music/constants"
import { useDraggable } from "@/hooks/useDraggable"

interface AsidePlayerProps {}

const WINDOW_NAME = "PLAYER"

const AsidePlayer: FC<AsidePlayerProps> = () => {
    // console.log("render asidePlayer")
    const winampState = useStore(winampStates.$winampState)
    const hidden = useStore(player.$compact)
    const useChangeCurentTimeHook = useChangeCurentTime()

    const { position, onDragging, onDragEnd, onDragStart } = useDraggable(WINDOW_NAME)

    return (
        <aside
            id="main-window"
            className={clsx(
                "fixed z-50  flex h-[116px] max-h-[116px] cursor-winamp flex-col bg-transparent pb-[9px] shadow-md",
                hidden && " overflow-hidden",
                "w-[275px]",
                winampState !== WINAMP_STATE.TRACKLOADED && "hidden"
            )}
            style={{ top: position.clientY, left: position.clientX }}
        >
            <TitleBar
                onMouseDown={onDragStart}
                onMouseMove={onDragging}
                onMouseUp={onDragEnd}
                onMouseLeave={onDragEnd}
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
