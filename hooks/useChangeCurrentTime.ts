import { playlist, progress, winampStates } from "@/features/media/winamp"
import { WINAMP_WINDOW_STATE } from "@/features/music/constants"
import { player } from "@/features/music/player"
import { useEvent, useStore } from "effector-react"
import React, { KeyboardEvent, useEffect } from "react"

const useChangeCurentTime = () => {
    const changeCurrentTime = useEvent(progress.keyChangeCurrentTime)

    useEffect(() => {
        const handler = (event: globalThis.KeyboardEvent) => {
            if (event.key === "ArrowLeft") return changeCurrentTime("backward")
            if (event.key === "ArrowRight") return changeCurrentTime("forward")
        }
        window.addEventListener("keydown", handler)
        window.addEventListener("keypress", handler)

        return () => {
            window.removeEventListener("keydown", handler)
            window.removeEventListener("keypress", handler)
        }
    }, [])
}

const useDelPressKeyButton = () => {
    const activeWindow = useStore(winampStates.$activeWindow)
    const handleDeleteTrackFormPlaylist = useEvent(playlist.removeTrackFromPlaylist)
    const selectedTrackInPlayList = useStore(playlist.$selectedTrackInPlayList)

    useEffect(() => {
        const handler = (event: globalThis.KeyboardEvent) => {
            if (event.key === "Delete") {
                if (activeWindow === WINAMP_WINDOW_STATE.PLAYLIST) {
                    console.log(event)
                    return handleDeleteTrackFormPlaylist(selectedTrackInPlayList!)
                }
            }
        }
        window.addEventListener("keydown", handler)
        window.addEventListener("keypress", handler)

        return () => {
            window.removeEventListener("keydown", handler)
            window.removeEventListener("keypress", handler)
        }
    }, [activeWindow, selectedTrackInPlayList])
}

export { useChangeCurentTime, useDelPressKeyButton }
