import { useEvent, useStore } from "effector-react"

import { eq } from "@/src/widgets/winamp/model"

import { EQSlider } from "./slider"
import { useCallback } from "react"

export const Sliders = () => {
    const bands = useStore(eq.$bands)
    const preamp = useStore(eq.$preamp)
    const handleChangePreamp = useEvent(eq.changePreampValue)
    const handleResetEQ = useEvent(eq.resetEqBand)

    const handleChangeAllBandsValues = useEvent(eq.changeAllBandsValues)

    const handleChange = useEvent(eq.changeEQBand)

    const memoHandleChange = useCallback((e) => handleChange(e), [])

    const handleSetMaxBandsValuesClicked = () => handleChangeAllBandsValues("max")
    const handleSetMinBandsValuesClicked = () => handleChangeAllBandsValues("min")
    const handleResetBandsValuesClicked = () => handleChangeAllBandsValues("reset")

    return (
        <div className="flex space-x-1 px-[21px] pt-1">
            <EQSlider
                name="preamp"
                value={preamp}
                onChange={handleChangePreamp}
                title="Предварительное усилинеие"
            />
            <div className=" flex w-3.5 flex-col justify-between" style={{ margin: "0 12px" }}>
                <button
                    className="h-2 w-4 cursor-winamp"
                    onClick={handleSetMaxBandsValuesClicked}
                ></button>
                <button
                    className="h-2 w-4 cursor-winamp"
                    onClick={handleResetBandsValuesClicked}
                ></button>
                <button
                    className="h-2 w-4 cursor-winamp"
                    onClick={handleSetMinBandsValuesClicked}
                ></button>
            </div>

            {Object.entries(bands).map(([key, value]) => (
                <EQSlider
                    name={key}
                    value={value}
                    key={key}
                    onChange={memoHandleChange}
                    reset={handleResetEQ}
                    title={`${key} Гц`}
                />
            ))}
        </div>
    )
}
