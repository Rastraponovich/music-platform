import { winampStates } from "@/features/media/winamp"
import { WINAMP_STATE } from "@/features/music/constants"
import { useStore } from "effector-react"
import React, { memo, FC } from "react"
import { EQWindow } from "@/src/features/winamp/eq-window"
import MainWindow from "./MainWindow/MainWindow"
import PlayListWindow from "./PlayListWindow/PlayListWindow"

interface WinampProps {}

const Winamp = () => {
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

export default Winamp
