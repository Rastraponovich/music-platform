import clsx from "clsx"
import { memo } from "react"

interface MonoStereoProps {
    numberOfChannels: number
}

const MonoStereo = ({ numberOfChannels }: MonoStereoProps) => {
    return (
        <div className="mono-stereo">
            <div id="stereo" className={clsx(numberOfChannels === 2 && "selected")}></div>
            <div id="mono" className={clsx(numberOfChannels !== 2 && "selected")}></div>
        </div>
    )
}

export default memo(MonoStereo)
