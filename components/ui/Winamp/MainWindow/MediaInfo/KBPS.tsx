import { memo } from "react"
import Character from "../../Character/Character"

interface KBPSProps {
    bitrate: number
}

const KBPS = ({ bitrate }: KBPSProps) => {
    return (
        <div id="kbps" className="text-opacity-0">
            <Character num={String(bitrate).charAt(0)} />
            <Character num={String(bitrate).charAt(1)} />
            <Character num={String(bitrate).charAt(2)} />
        </div>
    )
}

export default memo(KBPS)
