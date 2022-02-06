import { TIconSize } from "@/types/ui.types"
import clsx from "clsx"
import React, { memo, FC } from "react"

interface MinusIconProps {
    size?: TIconSize
    color?: string
}

const MinusIcon: FC<MinusIconProps> = ({ size = "normal", color = "currentColor" }) => {
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
                d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                clipRule="evenodd"
            />
        </svg>
    )
}

export default memo(MinusIcon)
