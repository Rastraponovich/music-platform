import { eq, winampStates } from "@/features/media/winamp"
import { $minimizedEQ } from "@/features/music/eq"
import useChangeCurentTime from "@/hooks/useChangeCurrentTime"
import clsx from "clsx"
import { useStore } from "effector-react"
import React, { memo, FC, useState, MouseEvent, useCallback } from "react"
import AudioPlayerButton from "../AudioPlayerButton"
import EQButtons from "./EQButtons"
import EQGraph from "./EQGraph"
import EQHeader from "./EQHeader"
import EQSlider from "./EQSlider"
import EQSliders from "./EQSliders"

interface EQWindowProps {}

const EQWindow: FC<EQWindowProps> = () => {
    const minimized = useStore($minimizedEQ)
    const visible = useStore(eq.$visibleEQ)

    const [pos, setpos] = useState<{ [key: string]: number | string }>({
        clientX: "1rem",
        clientY: "211px",
        bottom: "unset",
    })

    const [diff, setDiff] = useState({
        diffX: 0,
        diffY: 0,
    })

    const [allowDragging, setAllowDragging] = useState<boolean>(false)

    const handleDragStart = useCallback(
        (e: MouseEvent<HTMLElement>) => {
            e.preventDefault()
            setDiff({
                diffX: e.screenX - e.currentTarget.getBoundingClientRect().left,
                diffY: e.screenY - e.currentTarget.getBoundingClientRect().top,
            })
            setpos({ ...pos, bottom: "unset" })
            setAllowDragging(true)
        },
        [diff, pos, allowDragging]
    )
    const handleDragging = useCallback(
        (e: MouseEvent<HTMLElement>) => {
            if (allowDragging) {
                const left = e.screenX - diff.diffX
                const top = e.screenY - diff.diffY

                if (e.pageX === 0) {
                    return setTimeout(() => {
                        setpos({ ...pos, clientX: 0 })
                    }, 500)
                }

                setpos({ ...pos, clientX: left, clientY: top })
            }
        },
        [allowDragging, pos]
    )
    const handleDragEnd = useCallback(
        (e: MouseEvent<HTMLElement>) => setAllowDragging(false),
        [allowDragging]
    )
    return (
        <div
            id="equalizer-window"
            className={clsx(
                "absolute top-[116px] z-50 h-[116px] w-[275px]",
                minimized && "shade max-h-3.5 overflow-hidden",
                !visible && "hidden"
            )}
            style={{
                top: pos.clientY,
                left: pos.clientX,
                bottom: pos.bottom,
            }}
        >
            <EQHeader
                onMouseDown={handleDragStart}
                onMouseMove={handleDragging}
                onMouseUp={handleDragEnd}
                onMouseLeave={handleDragEnd}
            />
            <EQButtons />
            <EQSliders />
        </div>
    )
}

export default memo(EQWindow)
