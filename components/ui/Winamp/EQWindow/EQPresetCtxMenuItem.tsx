import React, { memo, FC } from "react"

interface EQPresetCtxMenuItemProps {
    text: string
    onClick?(): void
}

const EQPresetCtxMenuItem = ({ text, onClick }: EQPresetCtxMenuItemProps) => {
    return (
        <div
            className="px-4 pt-px pb-1 first-letter:uppercase hover:bg-[#224eb7] hover:text-white"
            onClick={onClick}
        >
            {text}
        </div>
    )
}

export default memo(EQPresetCtxMenuItem)
