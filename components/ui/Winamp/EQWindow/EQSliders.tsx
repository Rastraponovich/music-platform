import { useEvent, useStore } from "effector-react"

import { eq } from "@/features/media/winamp"

import EQSlider from "./EQSlider"

interface EQSlidersProps {}

const EQSliders = () => {
    const bands = useStore(eq.$bands)
    const preamp = useStore(eq.$preamp)
    const handleChangePreamp = useEvent(eq.changePreampValue)
    const handleResetEQ = useEvent(eq.resetEqBand)

    const handleChangeAllBandsValues = useEvent(eq.changeAllBandsValues)

    const handleChange = useEvent(eq.changeEQBand)
    return (
        <div className="flex space-x-1 pl-[21px] pt-1">
            <EQSlider name="preamp" value={preamp} onChange={handleChangePreamp} />
            <div
                className="mx-[11px] flex w-3.5 flex-col justify-between"
                style={{ margin: "0 13px" }}
            >
                <button
                    className="h-2 w-4 cursor-winamp"
                    onClick={() => handleChangeAllBandsValues("max")}
                ></button>
                <button
                    className="h-2 w-4 cursor-winamp"
                    onClick={() => handleChangeAllBandsValues("reset")}
                ></button>
                <button
                    className="h-2 w-4 cursor-winamp"
                    onClick={() => handleChangeAllBandsValues("min")}
                ></button>
            </div>

            {Object.entries(bands).map(([key, value]) => (
                <EQSlider
                    name={key}
                    value={value}
                    key={key}
                    onChange={handleChange}
                    reset={handleResetEQ}
                />
            ))}
        </div>
    )
}

export default EQSliders
