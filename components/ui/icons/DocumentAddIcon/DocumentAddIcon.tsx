import { TIconSize } from "@/types/ui.types"
import clsx from "clsx"
import React, { memo, FC } from "react"

interface DocumentAddIconProps {
    size?: TIconSize
    color?: string
}

const DocumentAddIcon: FC<DocumentAddIconProps> = ({ size = "normal", color = "currentColor" }) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            className={clsx(
                size === "normal" && "h-16 w-16",
                size === "small" && "h-8 w-8",
                size === "large" && "h-20 w-20"
            )}
            viewBox="0 0 20 20"
            fill={color}
        >
            <path
                fillRule="evenodd"
                d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V8z"
                clipRule="evenodd"
            />
        </svg>
    )
}

export default memo(DocumentAddIcon)
