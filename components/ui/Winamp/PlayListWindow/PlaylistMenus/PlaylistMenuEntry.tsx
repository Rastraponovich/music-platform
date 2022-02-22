import { useIsHovered } from "@/hooks/useIsHovered"
import clsx from "clsx"
import React, { memo, FC, ReactNode } from "react"

interface PlaylistMenuEntryProps {
    children: ReactNode
}

const PlaylistMenuEntry = ({ children }: PlaylistMenuEntryProps) => {
    const { ref, hover } = useIsHovered()
    return (
        <li ref={ref} className={clsx({ hover }, "h-[18px]")}>
            {children}
        </li>
    )
}

export default memo(PlaylistMenuEntry)
