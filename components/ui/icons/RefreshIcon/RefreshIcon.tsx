import { TIconSize } from "@/types/ui.types"
import clsx from "clsx"
import React, { memo, FC } from "react"

interface RefreshIconProps {
    size?: TIconSize
    color?: string
}

const RefreshIcon: FC<RefreshIconProps> = ({ size = "normal", color = "currentColor" }) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            className={clsx(
                size === "normal" && "h-16 w-16",
                size === "small" && "h-4 w-4",
                size === "large" && "h-20 w-20"
            )}
            viewBox="0 0 20 20"
            fill={color}
        >
            <path
                fillRule="evenodd"
                d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                clipRule="evenodd"
            />
        </svg>
    )
}

export default memo(RefreshIcon)
