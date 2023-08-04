import { eq } from "@/src/widgets/winamp/model"
import { useEvent, useStore } from "effector-react"
import { useCallback } from "react"
import { WinampButton } from "@/src/shared/ui/winamp/winamp-button"
import { EQGraph } from "./graph"

import { PresetMenu } from "./preset-menu"
import { selectors, actions } from "../model"
import { useEnabledEQ } from "../model/selectors"

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
    const enabledEQ = selectors.useEnabledEQ()
    const handleToggleOnEQButtonClicked = useEvent(actions.toggleEnabledEQ)

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
    const enabledAutoEQ = selectors.useAutoEQ()
    const handleToggle = useEvent(actions.toggleAutoEQ)
    return (
        <WinampButton id="auto" className="h-3 w-8" active={enabledAutoEQ} onClick={handleToggle} />
    )
}
