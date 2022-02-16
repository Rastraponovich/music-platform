import { winamp } from "@/features/media/winamp"
import { player } from "@/features/music/player"
import clsx from "clsx"
import { useEvent } from "effector-react"
import React, { memo, FC, useState, useCallback, MouseEvent } from "react"

interface TitleBarProps {
    onMouseDown: (e: MouseEvent<HTMLElement>) => void
    onMouseMove: (e: MouseEvent<HTMLElement>) => void
    onMouseUp: (e: MouseEvent<HTMLElement>) => void
    onMouseLeave: (e: MouseEvent<HTMLElement>) => void
}

const TitleBar: FC<TitleBarProps> = ({ onMouseDown, onMouseMove, onMouseUp, onMouseLeave }) => {
    const [selected, setSelected] = useState(false)
    const handleSetCompact = useEvent(player.onSetCompact)
    const handleClose = useEvent(winamp.close)

    const handleOnMouseDown = (e: MouseEvent<HTMLElement>) => {
        setSelected(true)
        onMouseDown(e)
    }

    return (
        <div
            id="titlebar"
            className={clsx("draggable title-bar relative flex", selected && "selected")}
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
