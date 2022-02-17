import clsx from "clsx"
import { memo, MouseEvent } from "react"
import { useEvent, useStore } from "effector-react"

import { winamp, winampStates } from "@/features/media/winamp"

interface TitleBarProps {
    onMouseDown: (e: MouseEvent<HTMLElement>) => void
    onMouseMove: (e: MouseEvent<HTMLElement>) => void
    onMouseUp: (e: MouseEvent<HTMLElement>) => void
    onMouseLeave: (e: MouseEvent<HTMLElement>) => void
}

const WINDOW_NAME = "PLAYER"

const TitleBar = ({ onMouseDown, onMouseMove, onMouseUp, onMouseLeave }: TitleBarProps) => {
    const windowState = useStore(winampStates.$activeWindow)
    const handleActiveWindow = useEvent(winampStates.changeWindowState)
    const handleSetCompact = () => {}
    const handleClose = useEvent(winamp.close)

    const handleOnMouseDown = (e: MouseEvent<HTMLElement>) => {
        handleActiveWindow(WINDOW_NAME)
        onMouseDown(e)
    }

    return (
        <div
            id="titlebar"
            className={clsx(
                "draggable title-bar relative flex",
                windowState === WINDOW_NAME && "selected"
            )}
            onMouseDown={handleOnMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseLeave}
        >
            <div id="option-context">
                <div className="h-full w-full">
                    <div id="option" title="Winamp Menu"></div>
                </div>
            </div>
            <button id="minimize" title="Minimize" className="" onClick={handleSetCompact}></button>
            <button
                id="shade"
                title="Toggle Windowshade Mode"
                className=""
                onClick={handleSetCompact}
            ></button>
            <button id="close" title="Close" className="" onClick={handleClose}></button>
        </div>
    )
}

export default memo(TitleBar)
