import { player } from "@/features/music/player"
import { useEvent, useStore } from "effector-react"
import React, { memo, FC, InputHTMLAttributes } from "react"

interface ProgressbarProps {
    className?: InputHTMLAttributes<HTMLInputElement>["className"]
    id?: string
}

//"col-span-8 col-start-3"

const Progressbar: FC<ProgressbarProps> = ({ className, id }) => {
    const duration = useStore(player.$duration)
    const currentTime = useStore(player.progress.$currentTime)

    const [handleSeeking, handleSeekingMouseDown, handleSeekingMouseUp] = useEvent([
        player.progress.seekingCurrentTime,
        player.progress.onmousedown,
        player.progress.onmouseup,
    ])

    return (
        <input
            id={id}
            type="range"
            min={0}
            max={duration}
            value={currentTime}
            onChange={handleSeeking}
            onMouseDown={handleSeekingMouseDown}
            onMouseUp={handleSeekingMouseUp}
            className={className}
        />
    )
}

export default memo(Progressbar)
