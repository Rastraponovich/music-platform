import clsx from "clsx"
import { memo, MouseEvent } from "react"
import { useEvent, useStore } from "effector-react"
import { eq, winampStates } from "@/features/media/winamp"
import { $minimizedEQ, toggleMinimizeEQ } from "@/features/music/eq"

interface EQHeaderProps {
    onMouseDown: (e: MouseEvent<HTMLElement>) => void
    onMouseMove: (e: MouseEvent<HTMLElement>) => void
    onMouseUp: (e: MouseEvent<HTMLElement>) => void
    onMouseLeave: (e: MouseEvent<HTMLElement>) => void
}

const WINDOW_NAME = "EQUALIZER"

const EQHeader = ({ onMouseDown, onMouseMove, onMouseUp, onMouseLeave }: EQHeaderProps) => {
    const minimized = useStore($minimizedEQ)
    const windowState = useStore(winampStates.$activeWindow)
    const handleActiveWinow = useEvent(winampStates.changeWindowState)

    const handleMinimize = useEvent(toggleMinimizeEQ)
    const handleCloseEQ = useEvent(eq.toggleVisibleEQ)

    const handleOnMouseDown = (e: MouseEvent<HTMLElement>) => {
        handleActiveWinow(WINDOW_NAME)
        onMouseDown(e)
    }

    return (
        <div
            className={clsx(
                "equalizer-top relative flex h-3.5 cursor-winamp-move justify-end",
                windowState === WINDOW_NAME && "active",
                minimized && "shade"
            )}
            onMouseDown={handleOnMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseLeave}
        >
            <button
                id="equalizer-shade"
                className="h-3.5 w-3.5 cursor-winamp-move"
                onClick={handleMinimize}
            />
            <button
                id="equalizer-close"
                className="h-3.5 w-3.5 cursor-winamp-move"
                onClick={handleCloseEQ}
            />
        </div>
    )
}

export default memo(EQHeader)
