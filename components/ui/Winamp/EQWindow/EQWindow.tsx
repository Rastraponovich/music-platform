import { $clutterBar, eq, winampStates } from "@/features/media/winamp"
import { useDraggable } from "@/hooks/useDraggable"
import clsx from "clsx"
import { useEvent, useStore } from "effector-react"
import { useRef } from "react"
import EQButtons from "./EQButtons"
import EQHeader from "./EQHeader"
import EQSliders from "./EQSliders"

interface EQWindowProps {}

const WINDOW_NAME = "EQUALIZER"

const EQWindow = () => {
    const minimized = useStore(eq.$minimized)
    const visible = useStore(eq.$visibleEQ)
    const ref = useRef(null)

    const clutter = useStore($clutterBar)
    const handleActiveWindow = useEvent(winampStates.changeWindowState)

    const [onDragStart, onDragging, onDragEnd] = useDraggable(WINDOW_NAME, ref)

    return (
        <div
            id="equalizer-window"
            className={clsx(
                "fixed top-[116px] z-50 h-[116px] w-[275px] cursor-winamp pixelated",
                minimized && "shade max-h-3.5 overflow-hidden",
                !visible && "hidden",
                clutter.d && "origin-top-left scale-[2]"
            )}
            ref={ref}
            onClick={() => handleActiveWindow(WINDOW_NAME)}
        >
            <EQHeader
                onMouseDown={onDragStart}
                onMouseMove={onDragging}
                onMouseUp={onDragEnd}
                onMouseLeave={onDragEnd}
            />
            <EQButtons />
            <EQSliders />
        </div>
    )
}

export default EQWindow
