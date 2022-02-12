import clsx from "clsx"
import React, { memo, FC, useState, useMemo, ChangeEvent } from "react"

interface EQSliderProps {
    name: string
    value: number
    onChange: (e: ChangeEvent<HTMLInputElement>) => void
    reset: (id: string) => void
}

const spriteOffsets = (number: number): { x: number; y: number } => {
    const x = number % 14
    const y = Math.floor(number / 14)
    return { x, y }
}

const spriteNumber = (value: number): number => {
    const percent = value / 100
    return Math.round(percent * 27)
}

const EQSlider = ({ name, value, onChange, reset }: EQSliderProps) => {
    const [active, setActive] = useState(false)

    const backgroundPosition = useMemo(() => {
        const { x, y } = spriteOffsets(spriteNumber(value))
        const xOffset = x * 15 // Each sprite is 15px wide
        const yOffset = y * 65 // Each sprite is 15px tall
        return `-${xOffset}px -${yOffset}px`
    }, [value])

    const handleDblClick = () => reset(name)
    return (
        <label
            className="inline-block, band-bg ml-[1px] flex h-[62px] w-3.5 p-0"
            style={{
                backgroundPosition,
            }}
        >
            <input
                id="band-slider"
                type="range"
                name={name}
                className={clsx(
                    "band  slider-thumb  -rotate-90 appearance-none",
                    active && "active"
                )}
                min="0"
                max="100"
                value={value}
                onMouseDown={() => setActive(true)}
                onMouseUp={() => setActive(false)}
                onChange={onChange}
                onDoubleClick={handleDblClick}
            />
        </label>
    )
}

export default EQSlider
