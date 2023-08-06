import { eq } from "@/src/widgets/winamp/model"
import { useEvent } from "effector-react"
import React, { memo, ReactNode } from "react"

interface PresetMenuButtonProps {
    onClick(): void
    children: ReactNode
}

const PresetMenuButton = memo(({ onClick, children }: PresetMenuButtonProps) => {
    console.log("render presets button")

    return (
        <button
            onClick={onClick}
            className="w-16 border-[0.5px] border-[#adadad] bg-[#e1e1e1] py-1 text-center font-[Arial] text-[10px]   leading-[8px] tracking-wide first-letter:uppercase  hover:border-[#0078d7] hover:bg-[#eeeeee]  active:border-[#0078d7]"
        >
            {children}
        </button>
    )
})
PresetMenuButton.displayName = "PresetMenuButton"

export const LoadPresetButton = () => {
    const setPresetButtonClicked = useEvent(eq.loadPreset)

    return <PresetMenuButton onClick={setPresetButtonClicked}>загрузить</PresetMenuButton>
}
export const ClosePresetMenuButton = () => {
    const toggleVisiblePresetMenuButtonClicked = useEvent(eq.toggleVisiblePresetWindow)

    return (
        <PresetMenuButton onClick={toggleVisiblePresetMenuButtonClicked}>отмена</PresetMenuButton>
    )
}
