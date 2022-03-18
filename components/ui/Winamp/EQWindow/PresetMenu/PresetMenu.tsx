import { eq, winampStates } from "@/features/media/winamp"
import { PRESET } from "@/features/music/types"
import { useDraggable } from "@/hooks/useDraggable"
import clsx from "clsx"
import { useEvent, useList, useStore } from "effector-react"
import { memo, useRef, useState } from "react"
import Preset from "./Preset"
import PresetTitle from "./PresetTitle"
import PresetMenuButton from "./PresetMenuButton"

const WINDOW_NAME = "PRESETS"

const PresetMenu = () => {
    const visiblePresetWindow = useStore(eq.$visiblePresetWindow)
    const setPreset = useEvent(eq.loadPreset)
    const toggleVisiblePresetMenu = useEvent(eq.toggleVisiblePresetWindow)
    const selectedPreset = useStore(eq.$selectedPreset)

    const ref = useRef(null)

    console.log("render presets")

    const [onDragStart, onDragging, onDragEnd] = useDraggable(WINDOW_NAME, ref)
    return (
        <div
            className={clsx(
                "fixed left-12 z-50 flex  w-[275px] flex-col text-xs shadow-md",
                !visiblePresetWindow && "hidden"
            )}
            ref={ref}
        >
            <PresetTitle
                onMouseDown={onDragStart}
                onMouseMove={onDragging}
                onMouseUp={onDragEnd}
                onMouseLeave={onDragEnd}
            />

            <div className="flex flex-col bg-[#f0f0f0] p-3">
                <div className="flex flex-col  overflow-y-scroll border-[0.5px] border-[#828790] bg-white p-px">
                    {useList(eq.$presets, {
                        keys: [selectedPreset],
                        fn: (preset) => <Preset preset={preset} />,
                    })}
                </div>
                <div className="mt-2 flex space-x-2 self-end ">
                    <PresetMenuButton onClick={setPreset}>загрузить</PresetMenuButton>
                    <PresetMenuButton onClick={toggleVisiblePresetMenu}>отмена</PresetMenuButton>
                </div>
            </div>
        </div>
    )
}

export default PresetMenu
