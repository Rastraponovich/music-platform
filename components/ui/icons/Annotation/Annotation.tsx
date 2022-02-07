import { TIconSize } from "@/types/ui.types"
import clsx from "clsx"
import React, { memo, FC } from "react"

interface AnnotationProps {
    size?: TIconSize
    color?: string
}

const Annotation: FC<AnnotationProps> = ({ size = "normal", color = "currentColor" }) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            className={clsx(
                size === "normal" && "h-8 w-8",
                size === "small" && "h-4 w-4",
                size === "large" && "h-20 w-20"
            )}
            viewBox="0 0 20 20"
            fill={color}
        >
            <path
                fillRule="evenodd"
                d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h3a1 1 0 100-2H6z"
                clipRule="evenodd"
            />
        </svg>
    )
}

export default memo(Annotation)
