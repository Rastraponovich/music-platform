import { player } from "@/features/music/player"
import { useStore } from "effector-react"
import { useEvent } from "effector-react/scope"
import React, { memo, FC, useState, useEffect, ChangeEvent, MouseEvent } from "react"

interface VolumeBarProps {}

const VolumeBar: FC<VolumeBarProps> = () => {
    const volume = useStore(player.volume.$volume)
    const onChangeVolume = useEvent(player.volume.changeVolume)
    const handleResetVolume = useEvent(player.volume.resetVolume)
    const [currentVolumeStep, setCurrentVolumeStep] = useState(Math.floor(volume / 3.57))

    useEffect(() => {
        setCurrentVolumeStep(Math.floor(volume / 3.57))
    }, [currentVolumeStep, volume])

    return (
        <div id="volume" style={{ backgroundPosition: `0px -${currentVolumeStep * 15 - 15}px` }}>
            <input
                type="range"
                min="0"
                max="100"
                step="1"
                title="Volume Bar"
                value={volume}
                // style={{ touchAction: "none;" }}
                onChange={onChangeVolume}
                className="slider-thumb  appearance-none"
                onDoubleClick={handleResetVolume}
            />
        </div>
    )
}

export default memo(VolumeBar)
