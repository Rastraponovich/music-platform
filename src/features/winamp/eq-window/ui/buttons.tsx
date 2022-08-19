import { eq } from "@/features/media/winamp"
import { useEvent, useStore } from "effector-react"
import { useCallback } from "react"
import { WinampButton } from "@/src/shared/ui/winamp/winamp-button"
import { EQGraph } from "./graph"

import { PresetMenu } from "./preset-menu"

export const EQButtons = () => {
    return (
        <div className="flex h-[19px] items-start justify-between px-3.5 pt-1">
            <EnableEQToggleButton />
            <AutoEQToggleButton />
            <EQGraph />
            <div className="relative flex items-start">
                <PresetMenuButton />
                <PresetMenu />
            </div>
        </div>
    )
}

const PresetMenuButton = () => {
    const visiblePresetWindow = useStore(eq.$visiblePresetWindow)
    const toggleVisiblePresetMenuButtonClicked = useEvent(eq.toggleVisiblePresetWindow)

    const handleTogglePresetMenuButtonClicked = useCallback(
        () => toggleVisiblePresetMenuButtonClicked(),
        [visiblePresetWindow]
    )

    return (
        <WinampButton
            id="presets"
            className="h-3 w-11"
            onClick={handleTogglePresetMenuButtonClicked}
        />
    )
}

const EnableEQToggleButton = () => {
    const enabledEQ = useStore(eq.$enabled)
    const handleEnableEQButtonClicked = useEvent(eq.enableClickedEQ)
    const handleDisableEQButtonClicked = useEvent(eq.disableClickedEQ)

    const handleToggleOnEQButtonClicked = useCallback(() => {
        if (enabledEQ) {
            handleDisableEQButtonClicked()
        } else {
            handleEnableEQButtonClicked()
        }
    }, [enabledEQ])

    return (
        <WinampButton
            id="on"
            className="h-3 w-[26px]"
            active={enabledEQ}
            onClick={handleToggleOnEQButtonClicked}
        />
    )
}
const AutoEQToggleButton = () => {
    const autoEQ = useStore(eq.$auto)
    const toggleAutoEQ = useEvent(eq.toggleAutoEQ)
    return <WinampButton id="auto" className="h-3 w-8" active={autoEQ} onClick={toggleAutoEQ} />
}
