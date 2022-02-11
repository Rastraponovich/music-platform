import { destroyPlayer, player } from "@/features/music/player"
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
    const handleDestroy = useEvent(destroyPlayer)
    const handleSelect = useCallback(() => {
        setSelected(!selected)
    }, [selected])

    return (
        <div
            id="titlebar"
            className={clsx("draggable title-bar relative flex", selected && "selected")}
            onClick={handleSelect}
            onMouseDown={onMouseDown}
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
            <button id="close" title="Close" className="" onClick={handleDestroy}></button>
        </div>
    )
}

export default memo(TitleBar)
