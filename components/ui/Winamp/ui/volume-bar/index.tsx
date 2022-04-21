import { useState, useEffect } from "react"

import { useEvent, useStore } from "effector-react/scope"

import { marqueInfo, volume } from "@/features/media/winamp"

interface VolumeBarProps {}

const VolumeBar = () => {
    const currentVolume = useStore(volume.$volume)
    const onChangeVolume = useEvent(volume.changeVolume)

    const handleMouseDown = useEvent(marqueInfo.enabledMarqueInfo)
    const handleMouseUp = useEvent(marqueInfo.disabledMarqueInfo)

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
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
            />
        </div>
    )
}

export default VolumeBar
