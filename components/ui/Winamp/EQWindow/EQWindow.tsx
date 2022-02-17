import { eq } from "@/features/media/winamp"
import { $minimizedEQ } from "@/features/music/eq"
import { useDraggable } from "@/hooks/useDraggable"
import clsx from "clsx"
import { useStore } from "effector-react"
import React, { memo, FC, useState, MouseEvent, useCallback, useRef } from "react"
import EQButtons from "./EQButtons"
import EQHeader from "./EQHeader"
import EQSliders from "./EQSliders"

interface EQWindowProps {}

const WINDOW_NAME = "EQUALIZER"

const EQWindow: FC<EQWindowProps> = () => {
    const minimized = useStore($minimizedEQ)
    const visible = useStore(eq.$visibleEQ)
    const ref = useRef(null)

    const [onDragStart, onDragging, onDragEnd] = useDraggable(WINDOW_NAME, ref)

    return (
        <div
            id="equalizer-window"
            className={clsx(
                "fixed top-[116px] z-50 h-[116px] w-[275px]",
                minimized && "shade max-h-3.5 overflow-hidden",
                !visible && "hidden"
            )}
            ref={ref}
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

export default memo(EQWindow)
