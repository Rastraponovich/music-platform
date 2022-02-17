import { eq } from "@/features/media/winamp"
import { $autoEQ, $enabledEQ, toggleAutoEQ } from "@/features/music/eq"
import { useEvent, useStore } from "effector-react"
import WinampButton from "../WinampButton"
import EQGraph from "./EQGraph"

interface EQButtonsProps {}

const EQButtons = () => {
    const autoEQ = useStore($autoEQ)
    const enabledEQ = useStore($enabledEQ)

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
            <WinampButton
                id="on"
                className="h-3 w-[26px]"
                active={enabledEQ}
                onClick={handleToggleONEQ}
            />
            <WinampButton id="auto" className="h-3 w-8" active={autoEQ} onClick={toggleAutoEQ} />
            <EQGraph />
            <WinampButton id="presets" className="h-3 w-11" />
        </div>
    )
}

export default EQButtons
