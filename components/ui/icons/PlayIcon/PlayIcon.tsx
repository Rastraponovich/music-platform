import { TIconSize } from "@/types/ui.types"
import clsx from "clsx"
import React, { memo, FC } from "react"

interface PlayIconProps {
    size?: TIconSize
    color?: string
}

const PlayIcon: FC<PlayIconProps> = ({ size = "normal", color = "currentColor" }) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            className={clsx(
                size === "normal" && "h-16 w-16",
                size === "small" && "h-8 w-8",
                size === "large" && "h-20 w-20",
                size === "extraSmall" && "h-4 w-4"
            )}
            viewBox="0 0 20 20"
            fill={color}
        >
            <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                clipRule="evenodd"
            />
        </svg>
    )
}

export default memo(PlayIcon)
