import React, { memo, FC } from "react"
import Character from "../../Character/Character"

interface KHZProps {
    sampleRate: number
}

const KHZ: FC<KHZProps> = ({ sampleRate }) => {
    return (
        <div id="khz" className="text-opacity-0">
            <Character num={String(sampleRate).charAt(0)} />
            <Character num={String(sampleRate).charAt(1)} />

            {/* <span className=" character character-52">4</span> */}
        </div>
    )
}

export default memo(KHZ)
