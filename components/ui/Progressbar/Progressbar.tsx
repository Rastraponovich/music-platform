import clsx from "clsx"
import { useEvent, useStore } from "effector-react"
import { memo, InputHTMLAttributes, useState, MouseEvent } from "react"

import { duration, marqueInfo, progress } from "@/features/media/winamp"

interface ProgressbarProps {
    className?: InputHTMLAttributes<HTMLInputElement>["className"]
    id?: string
}

//"col-span-8 col-start-3"

const Progressbar = ({ className, id }: ProgressbarProps) => {
    const currentTrackDuration = useStore(duration.$currentTrackDuration)
    const currentTime = useStore(progress.$currentTime)

    const handleMouseDown = useEvent(marqueInfo.enabledMarqueInfo)
    const handleMouseUp = useEvent(marqueInfo.disabledMarqueInfo)

    const [active, setActive] = useState(false)

    const [handleSeeking, mouseDown, mouseUp] = useEvent([
        progress.seekingCurrentTime,
        progress.onmousedown,
        progress.onmouseup,
    ])

    const onMouseDown = (e: MouseEvent<HTMLInputElement>) => {
        mouseDown(e)
        setActive(true)
        handleMouseDown()
    }

    const onMouseUp = (e: MouseEvent<HTMLInputElement>) => {
        mouseUp(e)
        setActive(false)
        handleMouseUp()
    }

    return (
        <input
            id={id}
            type="range"
            min={0}
            max={currentTrackDuration}
            value={currentTime}
            onChange={handleSeeking}
            onMouseDown={onMouseDown}
            onMouseUp={onMouseUp}
            className={clsx(
                className,
                active && "active",
                currentTrackDuration / 2 >= currentTime ? "left" : "right"
            )}
        />
    )
}

export default memo(Progressbar)
