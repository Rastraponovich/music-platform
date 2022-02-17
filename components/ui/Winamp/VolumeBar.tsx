import { useState, useEffect } from "react"

import { useEvent, useStore } from "effector-react/scope"

import { volume } from "@/features/media/winamp"

interface VolumeBarProps {}

const VolumeBar = () => {
    const currentVolume = useStore(volume.$volume)
    const onChangeVolume = useEvent(volume.changeVolume)
    const handleResetVolume = useEvent(volume.resetVolume)
    const [currentVolumeStep, setCurrentVolumeStep] = useState(Math.floor(currentVolume / 3.57))

    useEffect(() => {
        setCurrentVolumeStep(Math.floor(currentVolume / 3.57))
    }, [currentVolumeStep, currentVolume])

    return (
        <div id="volume" style={{ backgroundPosition: `0px -${currentVolumeStep * 15 - 15}px` }}>
            <input
                type="range"
                min="0"
                max="100"
                step="1"
                title="Volume Bar"
                value={currentVolume}
                onChange={onChangeVolume}
                className="slider-thumb  appearance-none"
                onDoubleClick={handleResetVolume}
            />
        </div>
    )
}

export default VolumeBar
