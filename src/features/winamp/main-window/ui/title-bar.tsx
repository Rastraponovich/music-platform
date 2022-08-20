import clsx from "clsx"
import { memo, MouseEvent } from "react"
import { useEvent, useStore } from "effector-react"

import { winamp, winampStates } from "@/features/media/winamp"
import { WinampButton } from "@/src/shared/ui/winamp/winamp-button"
import MiniTimer from "../../../../../components/ui/Winamp/PlayListWindow/MiniTimer"
import { MiniActions } from "@/src/features/winamp/mini-actions"

interface TitleBarProps {
    onMouseDown: (e: MouseEvent<HTMLElement>) => void
    onMouseMove: (e: MouseEvent<HTMLElement>) => void
    onMouseUp: (e: MouseEvent<HTMLElement>) => void
    onMouseLeave: (e: MouseEvent<HTMLElement>) => void
}

const WINDOW_NAME = "PLAYER"

export const TitleBar = memo(
    ({ onMouseDown, onMouseMove, onMouseUp, onMouseLeave }: TitleBarProps) => {
        const windowState = useStore(winampStates.$activeWindow)
        const handleMinimize = useEvent(winamp.minimize)

        const handleShade = useEvent(winamp.toggleShadePlayer)
        const shade = useStore(winampStates.$shadePlayer)

        const handleClose = useEvent(winamp.close)

        const handleOnMouseDown = (e: MouseEvent<HTMLElement>) => {
            onMouseDown(e)
        }

        return (
            <div
                id="title-bar"
                className={clsx(
                    "draggable title-bar relative flex h-3.5 w-[275px] cursor-winamp-move items-center pl-1.5 pt-[3px] pr-[3px] pb-0.5",
                    windowState === WINDOW_NAME && "selected",
                    shade && "shade min-h-[14px]"
                )}
                onMouseDown={handleOnMouseDown}
                onMouseMove={onMouseMove}
                onMouseUp={onMouseUp}
                onMouseLeave={onMouseLeave}
            >
                <button
                    id="option-context"
                    className="h-full w-3.5 cursor-winamp"
                    title="Winamp Menu"
                />
                <div className="grow"></div>

                {shade && <MiniTimer className="relative mr-[7px] items-center" />}

                {shade && <MiniActions />}
                <WinampButton
                    id="minimize"
                    title="Minimize"
                    className="h-[9px] w-[9px] cursor-winamp-move"
                    onClick={handleMinimize}
                />
                <WinampButton
                    id="shade"
                    title="Toggle Windowshade Mode"
                    className="h-[9px] w-[9px] cursor-winamp-move"
                    onClick={handleShade}
                />
                <WinampButton
                    id="close"
                    title="Close"
                    className="h-[9px] w-[9px] cursor-winamp-attention"
                    onClick={handleClose}
                />
            </div>
        )
    }
)
TitleBar.displayName = "TitleBar"
