import { winampStates } from "@/src/widgets/winamp/model"
import { WINAMP_STATE } from "@/features/music/constants"
import { useStore } from "effector-react"
import React from "react"
import { EQWindow } from "@/src/features/winamp/eq-window"
import { MainWindow } from "@/src/features/winamp/main-window"
import PlayListWindow from "@/components/ui/Winamp/PlayListWindow/PlayListWindow"
import { Hotkeys } from "@/src/shared/lib/hotkeys"
import { InitPlayer } from "@/src/shared/lib/init-player"

export const Winamp = () => {
    const state = useStore(winampStates.$winampState)
    return (
        <>
            {state !== WINAMP_STATE.DESTROYED && (
                <InitPlayer>
                    <Hotkeys>
                        <MainWindow />
                    </Hotkeys>
                    <EQWindow />
                    <PlayListWindow />
                </InitPlayer>
            )}
        </>
    )
}
