import { eq } from "@/features/media/winamp"
import { PRESETS_TYPE } from "@/features/music/types"
import { useEvent } from "effector-react"
import React, { memo, FC } from "react"

interface EQPresetCtxMenuItemProps {
    text: PRESETS_TYPE
    onClick?(): void
}

const EQPresetCtxMenuItem = ({ text, onClick }: EQPresetCtxMenuItemProps) => {
    const handleLoadPreset = useEvent(eq.loadPreset)
    return (
        <div
            className="px-4 pt-px pb-1 first-letter:uppercase hover:bg-[#224eb7] hover:text-white"
            onClick={() => handleLoadPreset(text)}
        >
            {text}
        </div>
    )
}

export default memo(EQPresetCtxMenuItem)
