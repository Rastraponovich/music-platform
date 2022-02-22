import clsx from "clsx"
import React, { memo, FC, useState, useMemo, ChangeEvent } from "react"

interface EQSliderProps {
    name: string
    value: number
    onChange: (e: ChangeEvent<HTMLInputElement>) => void
    reset?: (id: string) => void
    title?: string
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

const EQSlider = ({ name, value, onChange, reset, title }: EQSliderProps) => {
    const [active, setActive] = useState(false)

    const backgroundPosition = useMemo(() => {
        const { x, y } = spriteOffsets(spriteNumber(value))
        const xOffset = x * 15 // Each sprite is 15px wide
        const yOffset = y * 65 // Each sprite is 15px tall
        return `-${xOffset}px -${yOffset}px`
    }, [value])

    const handleDblClick = () => reset && reset(name)
    return (
        <label
            className="ml-[1px] flex  h-[62px] w-3.5 bg-band-bg p-0"
            style={{ backgroundPosition }}
        >
            <input
                id="band-slider"
                type="range"
                name={name}
                className={clsx(
                    "slider-thumb  -rotate-90 cursor-winamp-position-y appearance-none",
                    "m-0 h-3.5 w-[62px] origin-[31px_31px] bg-transparent",
                    active && "active"
                )}
                min="0"
                max="100"
                value={value}
                title={title}
                onMouseDown={() => setActive(true)}
                onMouseUp={() => setActive(false)}
                onChange={onChange}
                onDoubleClick={handleDblClick}
            />
        </label>
    )
}

export default memo(EQSlider)
