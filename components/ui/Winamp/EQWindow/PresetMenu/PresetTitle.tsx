import { winampStates } from "@/features/media/winamp"
import clsx from "clsx"
import { useStore } from "effector-react"
import { memo, MouseEvent } from "react"

interface PresetTitleProps {
    onMouseDown: (e: MouseEvent<HTMLElement>) => void
    onMouseMove: (e: MouseEvent<HTMLElement>) => void
    onMouseUp: (e: MouseEvent<HTMLElement>) => void
    onMouseLeave: (e: MouseEvent<HTMLElement>) => void
}

const WINDOW_NAME = "PRESETS"
const PresetTitle = ({ onMouseDown, onMouseMove, onMouseUp, onMouseLeave }: PresetTitleProps) => {
    const activeWindow = useStore(winampStates.$activeWindow)
    return (
        <h3
            className={clsx(
                "  bg-white px-[2px] py-[4px] text-gray-400 first-letter:uppercase",
                activeWindow === WINDOW_NAME && "bg-[#0078d7] text-gray-50"
            )}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseLeave}
        >
            загрузка заготовки для эквалайзера
        </h3>
    )
}

export default memo(PresetTitle)
