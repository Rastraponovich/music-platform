import { TWinampWindow } from "@/features/music/types"
import { useDraggable } from "@/hooks/useDraggable"
import React, { memo, FC, useRef, ReactNode } from "react"

interface DraggableProps {
    children: ReactNode
    WINDOW_NAME: TWinampWindow
}

const Draggable = ({ children, WINDOW_NAME }: DraggableProps) => {
    const ref = useRef<any>(null)

    const [onDragStart, onDragging, onDragEnd] = useDraggable(WINDOW_NAME, ref)
    return (
        <div
            ref={ref}
            onMouseDown={onDragStart}
            onMouseMove={onDragging}
            onMouseUp={onDragEnd}
            //   style={{
            //     position: "absolute",
            //     top: 0,
            //     left: 0,
            //     transform: `translate(${w.x}px, ${w.y}px)`,
            //     touchAction: "none",
            //   }}
        >
            {children}
        </div>
    )
}

export default memo(Draggable)
