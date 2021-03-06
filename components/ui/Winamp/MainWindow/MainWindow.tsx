import clsx from "clsx"
import { useEvent, useStore } from "effector-react"
import { useRef } from "react"

import { $clutterBar, winamp, winampStates } from "@/features/media/winamp"

import { useDraggable } from "@/hooks/useDraggable"
import { useInitPlayer } from "@/hooks/useInitPlayer"
import { useChangeCurentTime } from "@/hooks/useChangeCurrentTime"

import Controls from "./Controls"
import TitleBar from "./TitleBar"
import StatusBar from "./StatusBar"
import VolumeBar from "../VolumeBar"
import BalanceBar from "./BalanceBar"
import WindowControls from "./WindowControls"
import MediaInfo from "./MediaInfo/MediaInfo"
import Progressbar from "../../Progressbar/Progressbar"
import Draggable from "@/components/Draggable/Draggable"

interface AsidePlayerProps {}

const WINDOW_NAME = "PLAYER"

const MainWindow = () => {
    console.log("render asidePlayer")
    useInitPlayer()

    const visiblePlayer = useStore(winampStates.$visiblePlayer)

    const clutter = useStore($clutterBar)

    const shade = useStore(winampStates.$shadePlayer)

    const useChangeCurentTimeHook = useChangeCurentTime()
    const ref = useRef(null)

    const [onDragStart, onDragging, onDragEnd] = useDraggable(WINDOW_NAME, ref)

    const handleActiveWindow = useEvent(winampStates.changeWindowState)

    return (
        <aside
            id="main-window"
            className={clsx(
                "fixed z-50  flex h-[116px]  cursor-winamp flex-col bg-transparent pb-[9px] shadow-md",
                // hidden && " overflow-hidden", //minimize state
                "w-[275px]",
                !visiblePlayer && "hidden",
                shade && "max-h-3.5 overflow-hidden pb-0",
                clutter.d && "origin-top-left scale-[2]"
            )}
            ref={ref}
            onClick={() => handleActiveWindow(WINDOW_NAME)}
        >
            <TitleBar
                onMouseDown={onDragStart}
                onMouseMove={onDragging}
                onMouseUp={onDragEnd}
                onMouseLeave={onDragEnd}
            />
            <div className="my-2 flex pr-2 pl-[9px]">
                <StatusBar />
                <MediaInfo />
                <VolumeBar />
                <BalanceBar />
                <WindowControls />
            </div>

            <Progressbar
                id="position"
                className="slider-thumb ml-4  mb-[7px] h-2.5 w-[248px] appearance-none bg-progresbar-player"
            />
            <Controls />
        </aside>
    )
}

export default MainWindow
