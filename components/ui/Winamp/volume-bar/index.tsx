
import { useEvent } from "effector-react/scope"

import { marqueInfo, volume } from "@/features/media/winamp"
import { VOLUME_BG_OFFSET } from "./lib"
import { selectors } from "./model"

const VolumeBar = () => {
    const currentVolume = selectors.useCurrentVolume()
    const currentVolumeStep = selectors.useCurrentVolumeStep()
    const onChangeVolume = useEvent(volume.changeVolume)
    const handleMouseDown = useEvent(marqueInfo.enabledMarqueInfo)
    const handleMouseUp = useEvent(marqueInfo.disabledMarqueInfo)

    return (
        <div
            id="volume"
            style={{
                backgroundPosition: `0px -${
                    currentVolumeStep! * VOLUME_BG_OFFSET - VOLUME_BG_OFFSET
                }px`,
            }}
        >
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
