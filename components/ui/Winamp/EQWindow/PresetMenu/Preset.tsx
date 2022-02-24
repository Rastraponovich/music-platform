import { eq } from "@/features/media/winamp"
import { PRESET, PRESETS_TYPE } from "@/features/music/types"
import clsx from "clsx"
import { useEvent, useStore } from "effector-react"
import React, { memo, FC } from "react"

interface PresetProps {
    preset: PRESET
}

const Preset = ({ preset }: PresetProps) => {
    const selected = useStore(eq.$selectedPreset)
    const handleSelectPreset = useEvent(eq.selectPreset)
    return (
        <div
            className={clsx(
                "lowercase first-letter:uppercase ",
                selected?.name === preset.name && "bg-[#0078d7] text-white"
            )}
            onClick={() => handleSelectPreset(preset)}
        >
            {preset.name}
        </div>
    )
}

export default memo(Preset)
