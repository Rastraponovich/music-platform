import { player } from "@/features/music/player"
import { useEvent, useStore } from "effector-react"
import React, { memo, FC, InputHTMLAttributes } from "react"

interface ProgressbarProps {
    className?: InputHTMLAttributes<HTMLInputElement>["className"]
}

//"col-span-8 col-start-3"

const Progressbar: FC<ProgressbarProps> = ({ className }) => {
    const duration = useStore(player.$duration)
    const currentTime = useStore(player.progress.$progress)

    const handleSeeking = useEvent(player.onSeeking)
    const handleSeekingMouseDown = useEvent(player.progress.onmousedown)
    const handleSeekingMouseUp = useEvent(player.progress.onmouseup)

    return (
        <input
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
