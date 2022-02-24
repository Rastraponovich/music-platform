import { eq } from "@/features/media/winamp"
import { useEvent, useStore } from "effector-react"
import { useCallback, useState } from "react"
import WinampButton from "../WinampButton"
import EQGraph from "./EQGraph"

import PresetMenu from "./PresetMenu/PresetMenu"

const EQButtons = () => {
    const autoEQ = useStore(eq.$auto)
    const enabledEQ = useStore(eq.$enabled)

    const handleEnableEQ = useEvent(eq.enableClickedEQ)
    const handleDisableEQ = useEvent(eq.disableClickedEQ)
    const toggleAutoEQ = useEvent(eq.toggleAutoEQ)

    const visiblePresetWindow = useStore(eq.$visiblePresetWindow)
    const toggleVisiblePresetMenu = useEvent(eq.toggleVisiblePresetWindow)

    const handleToggleONEQ = useCallback(() => {
        if (enabledEQ) {
            handleDisableEQ()
        } else {
            handleEnableEQ()
        }
    }, [enabledEQ])

    const handleTogglePresetMenu = useCallback(
        () => toggleVisiblePresetMenu(),
        [visiblePresetWindow]
    )

    return (
        <div className="flex h-[19px] items-start justify-between px-3.5 pt-1">
            <WinampButton
                id="on"
                className="h-3 w-[26px]"
                active={enabledEQ}
                onClick={handleToggleONEQ}
            />
            <WinampButton id="auto" className="h-3 w-8" active={autoEQ} onClick={toggleAutoEQ} />
            <EQGraph />
            <div className="relative flex items-start">
                <WinampButton id="presets" className="h-3 w-11" onClick={handleTogglePresetMenu} />
                <PresetMenu />
            </div>
        </div>
    )
}

export default EQButtons
