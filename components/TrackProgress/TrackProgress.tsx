import {  ChangeEventHandler, memo } from "react"

interface TrackProgressProps {
    currentValue: number
    maxValue: number | string
    onChange: ChangeEventHandler<HTMLInputElement>
}

const TrackProgress = ({ currentValue, maxValue, onChange }: TrackProgressProps) => {
    return (
        <div className="flex flex-col">
            <input type="range" min={0} max={maxValue} value={currentValue} onChange={onChange} />
            <span>
                {currentValue} / {maxValue}
            </span>
        </div>
    )
}

export default memo(TrackProgress)
