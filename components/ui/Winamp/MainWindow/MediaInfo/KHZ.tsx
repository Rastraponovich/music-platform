import { memo } from "react"
import Character from "../../Character/Character"

interface KHZProps {
    sampleRate: number
}

const KHZ = ({ sampleRate }: KHZProps) => {
    return (
        <div id="khz" className="text-opacity-0">
            <Character num={String(sampleRate).charAt(0)} />
            <Character num={String(sampleRate).charAt(1)} />
        </div>
    )
}

export default memo(KHZ)
