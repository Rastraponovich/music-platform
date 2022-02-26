import { MEDIA_STATUS } from "@/features/media/constants"
import { winamp, winampStates } from "@/features/media/winamp"
import { WINAMP_STATE } from "@/features/music/constants"
import clsx from "clsx"
import { useEvent, useStore } from "effector-react"
import WinampIcon from "../icons/WinampIcon/WinampIcon"

const WinampLayoutButton = () => {
    const handleShowWinamp = useEvent(winamp.show)
    const mediaState = useStore(winamp.$mediaStatus)
    const playerState = useStore(winampStates.$winampState)

    const pulse = mediaState === MEDIA_STATUS.PLAYING && playerState === WINAMP_STATE.MINIMIZED

    return (
        <button
            onClick={handleShowWinamp}
            className={clsx(
                "btn btn-ghost no-animation btn-square btn-md fixed bottom-8 right-8 z-50   rounded-full bg-[#3D4451] ",
                pulse && "animate-pulse",
                playerState !== WINAMP_STATE.MINIMIZED && "opacity-50"
            )}
        >
            <WinampIcon size="small" />
        </button>
    )
}

export default WinampLayoutButton
