import { $minimizedEQ, toggleMinimizeEQ, toggleVisibleEQ } from "@/features/music/eq"
import clsx from "clsx"
import { useEvent, useStore } from "effector-react"
import { memo, MouseEvent, useState } from "react"

interface EQHeaderProps {
    onMouseDown: (e: MouseEvent<HTMLElement>) => void
    onMouseMove: (e: MouseEvent<HTMLElement>) => void
    onMouseUp: (e: MouseEvent<HTMLElement>) => void
    onMouseLeave: (e: MouseEvent<HTMLElement>) => void
}

const EQHeader = ({ onMouseDown, onMouseMove, onMouseUp, onMouseLeave }: EQHeaderProps) => {
    const [active, setActive] = useState(false)
    const minimized = useStore($minimizedEQ)

    const handleMinimize = useEvent(toggleMinimizeEQ)
    const handleCloseEQ = useEvent(toggleVisibleEQ)

    const handleOnMouseDown = (e: MouseEvent<HTMLElement>) => {
        setActive(true)
        onMouseDown(e)
    }

    return (
        <div
            className={clsx(
                "equalizer-top relative flex h-3.5 justify-end",
                active && "active",
                minimized && "shade"
            )}
            onClick={() => setActive(true)}
            onMouseDown={handleOnMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseLeave}
        >
            <button
                id="equalizer-shade"
                className="h-3.5 w-3.5 cursor-winamp-move"
                onClick={handleMinimize}
            ></button>
            <button
                id="equalizer-close"
                className="h-3.5 w-3.5 cursor-winamp-move"
                onClick={handleCloseEQ}
            ></button>
        </div>
    )
}

export default memo(EQHeader)
