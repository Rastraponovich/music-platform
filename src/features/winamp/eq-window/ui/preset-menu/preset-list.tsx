import { eq } from "@/src/widgets/winamp/model"
import { PRESET } from "@/features/music/types"
import clsx from "clsx"
import { useEvent, useList, useStore } from "effector-react"
import React, { memo } from "react"

interface PresetProps {
    preset: PRESET
}

const Preset = memo(({ preset }: PresetProps) => {
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
})
Preset.displayName = "Preset"

export const PresetsList = () => {
    const selectedPreset = useStore(eq.$selectedPreset)

    return (
        <div className="flex flex-col  overflow-y-scroll border-[0.5px] border-[#828790] bg-white p-px">
            {useList(eq.$presets, {
                keys: [selectedPreset],
                fn: (preset) => <Preset preset={preset} />,
            })}
        </div>
    )
}
