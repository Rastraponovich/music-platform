import { eq } from "@/features/media/winamp"
import { useEvent, useStore } from "effector-react"
import { useCallback, useState } from "react"
import WinampButton from "../WinampButton"
import EQPresetCtxMenuItem from "./EQPresetCtxMenuItem"
import EQGraph from "./EQGraph"

import { useOnClickAway } from "@/hooks/useOnClickAway"

interface EQButtonsProps {}

const EQButtons = () => {
    const autoEQ = useStore(eq.$auto)
    const enabledEQ = useStore(eq.$enabled)
    const handleEnableEQ = useEvent(eq.enableClickedEQ)
    const handleDisableEQ = useEvent(eq.disableClickedEQ)
    const toggleAutoEQ = useEvent(eq.toggleAutoEQ)

    const [selected, setSelected] = useState(false)

    const [ref, setRef] = useState<Element | null>(null)

    const callback = useCallback(() => {
        // If we've clicked on a Context Menu spawed inside this menu, it will
        // register as an external click. However, hiding the menu will remove
        // the Context Menu from the DOM. Therefore, we wait until the next
        // event loop to actually hide ourselves.
        setTimeout(() => {
            // Close the menu
            setSelected(false)
        }, 0)
    }, [])

    useOnClickAway(ref, selected ? callback : null)

    const handleToggleONEQ = useCallback(() => {
        if (enabledEQ) {
            handleDisableEQ()
        } else {
            handleEnableEQ()
        }
    }, [enabledEQ])

    const handleTogglePresetMenu = useCallback(
        () => setSelected((selected_) => !selected_),
        [selected]
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
                {selected && (
                    <div
                        className="absolute left-12 flex flex-col border border-[#a7a394] bg-white p-px text-xs shadow-md"
                        onClick={handleTogglePresetMenu}
                        ref={setRef}
                    >
                        {["default", "rock", "techno"].map((val) => (
                            <EQPresetCtxMenuItem
                                key={val}
                                text={val}
                                onClick={() => console.log(val)}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default EQButtons
