import React, { memo, FC, ReactNode } from "react"

interface PresetMenuButtonProps {
    onClick(): void
    children: ReactNode
}

const PresetMenuButton = ({ onClick, children }: PresetMenuButtonProps) => {
    console.log("render presets button")

    return (
        <button
            onClick={onClick}
            className="w-16 border-[0.5px] border-[#adadad] bg-[#e1e1e1] py-1 text-center font-[Arial] text-[10px]  leading-[8px] tracking-wide first-letter:uppercase  hover:border-[#0078d7] hover:bg-[#eeeeee]  active:border-[#0078d7]"
        >
            {children}
        </button>
    )
}

export default memo(PresetMenuButton)
