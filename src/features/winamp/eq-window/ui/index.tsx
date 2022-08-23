import { useDraggable } from "@/hooks/useDraggable"
import clsx from "clsx"
import { useEvent } from "effector-react"
import { useRef } from "react"
import { selectors, actions } from "../model"
import { EQButtons } from "./buttons"
import { EQHeader } from "./header"
import { Sliders } from "./sliders"

const WINDOW_NAME = "EQUALIZER"

export const EQWindow = () => {
    const minimized = selectors.useMinimized()
    const visibled = selectors.useVisibled()
    const ref = useRef(null)

    const clutter = selectors.useClutterBar()
    const handleActiveWindow = useEvent(actions.changedWindowState)

    const handleActiveWindowClicked = () => handleActiveWindow(WINDOW_NAME)

    const [onDragStart, onDragging, onDragEnd] = useDraggable(WINDOW_NAME, ref)

    return (
        <div
            id="equalizer-window"
            className={clsx(
                "fixed top-[116px] z-50 h-[116px] w-[275px] cursor-winamp pixelated",
                minimized && "shade max-h-3.5 overflow-hidden",
                !visibled && "hidden",
                clutter.d && "origin-top-left scale-[2]"
            )}
            ref={ref}
            onClick={handleActiveWindowClicked}
        >
            <EQHeader
                onMouseDown={onDragStart}
                onMouseMove={onDragging}
                onMouseUp={onDragEnd}
                onMouseLeave={onDragEnd}
            />
            <EQButtons />
            <Sliders />
        </div>
    )
}
