import { player } from "@/features/music/player"
import clsx from "clsx"
import { useEvent, useStore } from "effector-react"
import React, { memo, FC, InputHTMLAttributes, useState, ChangeEvent, MouseEvent } from "react"

interface ProgressbarProps {
    className?: InputHTMLAttributes<HTMLInputElement>["className"]
    id?: string
}

//"col-span-8 col-start-3"

const Progressbar: FC<ProgressbarProps> = ({ className, id }) => {
    const duration = useStore(player.$duration)
    const currentTime = useStore(player.progress.$currentTime)

    const [active, setActive] = useState(false)

    const [handleSeeking, mouseDown, mouseUp] = useEvent([
        player.progress.seekingCurrentTime,
        player.progress.onmousedown,
        player.progress.onmouseup,
    ])

    const onMouseDown = (e: MouseEvent<HTMLInputElement>) => {
        mouseDown(e)
        setActive(true)
    }

    const onMouseUp = (e: MouseEvent<HTMLInputElement>) => {
        mouseUp(e)
        setActive(false)
    }

    return (
        <input
            id={id}
            type="range"
            min={0}
            max={duration}
            value={currentTime}
            onChange={handleSeeking}
            onMouseDown={onMouseDown}
            onMouseUp={onMouseUp}
            className={clsx(
                className,
                active && "active",
                duration / 2 >= currentTime ? "left" : "right"
            )}
        />
    )
}

export default memo(Progressbar)
