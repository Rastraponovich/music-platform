import { TIconSize } from "@/types/ui.types"
import clsx from "clsx"
import React, { memo, FC } from "react"

interface DocumentTextIconProps {
    size?: TIconSize
    color?: string
}

const DocumentTextIcon: FC<DocumentTextIconProps> = ({
    size = "normal",
    color = "currentColor",
}) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            className={clsx(
                size === "normal" && "h-8 w-8",
                size === "small" && "h-4 w-4",
                size === "large" && "h-16 w-16"
            )}
        >
            <path
                fillRule="evenodd"
                d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                clipRule="evenodd"
            />
        </svg>
    )
}

export default memo(DocumentTextIcon)
