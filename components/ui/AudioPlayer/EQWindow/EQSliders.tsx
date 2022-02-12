import {
    $frequency,
    $preamp,
    changeFrequency,
    changePreamp,
    resetFrequency,
    resetPreamp,
} from "@/features/music/eq"
import { useEvent, useList, useStore } from "effector-react"
import React, { memo, FC } from "react"
import EQSlider from "./EQSlider"

interface EQSlidersProps {}

const EQSliders: FC<EQSlidersProps> = () => {
    const freq = useStore($frequency)
    const preamp = useStore($preamp)
    const handleChangePreamp = useEvent(changePreamp)
    const handleResetEQ = useEvent(resetFrequency)
    const handleResetPreamp = useEvent(resetPreamp)

    const handleChange = useEvent(changeFrequency)
    return (
        <div className="flex space-x-1 pl-[21px] pt-1">
            <EQSlider
                name="preamp"
                value={preamp}
                onChange={handleChangePreamp}
                reset={handleResetPreamp}
            />
            <div className="mx-[11px] flex w-3.5 flex-col" style={{ margin: "0 13px" }}></div>

            {Object.entries(freq).map(([key, value]) => (
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

export default memo(EQSliders)
