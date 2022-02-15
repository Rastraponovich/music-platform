import { eq } from "@/features/media/winamp"
import { $autoEQ, $enabledEQ, toggleAutoEQ, toggleEnabledEQ } from "@/features/music/eq"
import { useEvent, useStore } from "effector-react"
import React, { memo, FC } from "react"
import AudioPlayerButton from "../AudioPlayerButton"
import EQGraph from "./EQGraph"

interface EQButtonsProps {}

const EQButtons: FC<EQButtonsProps> = () => {
    const autoEQ = useStore($autoEQ)
    const enabledEQ = useStore($enabledEQ)

    const handleToggleAutoEQ = useEvent(toggleAutoEQ)

    const handleEnableEQ = useEvent(eq.enableClickedEQ)
    const handleDisableEQ = useEvent(eq.disableClickedEQ)

    const handleToggleONEQ = () => {
        if (enabledEQ) {
            handleDisableEQ()
        } else {
            handleEnableEQ()
        }
    }

    return (
        <div className="flex h-[19px] items-start px-3.5 pt-1">
            <AudioPlayerButton
                id="on"
                className="h-3 w-[26px]"
                selected={enabledEQ}
                onClick={handleToggleONEQ}
            />
            <AudioPlayerButton
                id="auto"
                className="h-3 w-8"
                selected={autoEQ}
                onClick={toggleAutoEQ}
            />
            <EQGraph />
            <AudioPlayerButton id="presets" className="h-3 w-11" />
        </div>
    )
}

export default EQButtons
