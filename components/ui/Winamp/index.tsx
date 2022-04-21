import { winampStates } from "@/features/media/winamp"
import { WINAMP_STATE } from "@/features/music/constants"
import { useStore } from "effector-react"
import EQWindow from "./EQWindow/EQWindow"
import { MainWindow } from "./MainWindow/ui/main-window"
import PlayListWindow from "./PlayListWindow/ui/playlist-window"

export const Winamp = () => {
    const state = useStore(winampStates.$winampState)
    return (
        <>
            {state !== WINAMP_STATE.DESTROYED && (
                <>
                    <MainWindow />
                    <EQWindow />
                    <PlayListWindow />
                </>
            )}
        </>
    )
}
