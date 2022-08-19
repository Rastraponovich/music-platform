import { marqueInfo } from "@/features/media/winamp"
import clsx from "clsx"
import { useEvent } from "effector-react"
import React, { memo, useState, useMemo, ChangeEvent, MouseEvent } from "react"

const WIDE_SPRITE = 15
const TALL_SPRITE = 65
const OFFSET = 14
const SPRITE_ELEMENT_OFFSET = 27

interface EQSliderProps {
    name: string
    value: number
    onChange: (e: ChangeEvent<HTMLInputElement>) => void
    reset?: (id: string) => void
    title?: string
}

const spriteOffsets = (number: number): { x: number; y: number } => {
    const x = number % OFFSET
    const y = Math.floor(number / OFFSET)
    return { x, y }
}

const spriteNumber = (value: number): number => {
    const percent = value / 100
    return Math.round(percent * SPRITE_ELEMENT_OFFSET)
}

export const EQSlider = memo(({ name, value, onChange, reset, title }: EQSliderProps) => {
    const [active, setActive] = useState(false)

    const mouseDown = useEvent(marqueInfo.enabledMarqueInfo)
    const mouseUp = useEvent(marqueInfo.disabledMarqueInfo)

    const handleMouseUp = (e: MouseEvent<HTMLInputElement>) => {
        setActive(false)
        mouseUp()
    }
    const handleMouseDown = (e: MouseEvent<HTMLInputElement>) => {
        setActive(true)
        mouseDown()
    }

    const backgroundPosition = useMemo(() => {
        const { x, y } = spriteOffsets(spriteNumber(value))
        const xOffset = x * WIDE_SPRITE
        const yOffset = y * TALL_SPRITE
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
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onChange={onChange}
                onDoubleClick={handleDblClick}
            />
        </label>
    )
})
EQSlider.displayName = "EQSlider"