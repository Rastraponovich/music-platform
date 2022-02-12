import clsx from "clsx"
import { debounce } from "lodash"
import React, { memo, FC, useState } from "react"

interface AudioPlayerButtonProps {
    id: string
    className?: string
    selected?: boolean
    onClick?(): void
}

const AudioPlayerButton = ({ id, className, selected, onClick }: AudioPlayerButtonProps) => {
    const [active, setActive] = useState(false)
    const handleClick = () => setActive((prev) => !prev)
    const onMouseLeave = () => {
        setTimeout(() => {
            setActive(false)
        }, 300)
    }
    return (
        <button
            id={id}
            className={clsx(className, "cursor-winamp", selected && "selected", active && "active")}
            onMouseDown={handleClick}
            onMouseUp={handleClick}
            onMouseLeave={onMouseLeave}
            onClick={onClick}
        ></button>
    )
}

export default memo(AudioPlayerButton)
