import { playlist, progress, volume, winampStates } from "@/features/media/winamp"
import { WINAMP_WINDOW_STATE } from "@/features/music/constants"
import { useEvent, useStore } from "effector-react"
import { useEffect } from "react"

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
    const handleSelectTrackInPlaylist = useEvent(playlist.selectTrackInPlaylist)
    const playTrack = useEvent(playlist.doubleClick)
    const playlistLength = useStore(playlist.$playlistLength)

    const handleSetVolume = useEvent(volume.setVolumeFromKeys)

    useEffect(() => {
        const handler = (event: globalThis.KeyboardEvent) => {
            if (event.key === "Delete") {
                if (activeWindow === WINAMP_WINDOW_STATE.PLAYLIST) {
                    return handleDeleteTrackFormPlaylist(selectedTrackInPlayList!)
                }
            }
            if (event.key === "ArrowUp") {
                if (activeWindow === WINAMP_WINDOW_STATE.PLAYER) {
                    event.preventDefault()
                    handleSetVolume("up")
                }

                if (activeWindow === WINAMP_WINDOW_STATE.PLAYLIST) {
                    if (selectedTrackInPlayList !== null) {
                        event.preventDefault()

                        if (selectedTrackInPlayList > 0)
                            return handleSelectTrackInPlaylist(selectedTrackInPlayList - 1)
                        return handleSelectTrackInPlaylist(playlistLength - 1)
                    }
                }
            }
            if (event.key === "ArrowDown") {
                if (activeWindow === WINAMP_WINDOW_STATE.PLAYER) {
                    event.preventDefault()
                    handleSetVolume("down")
                }

                if (activeWindow === WINAMP_WINDOW_STATE.PLAYLIST) {
                    if (selectedTrackInPlayList !== null) {
                        event.preventDefault()
                        if (selectedTrackInPlayList === playlistLength - 1)
                            return handleSelectTrackInPlaylist(0)
                        return handleSelectTrackInPlaylist(selectedTrackInPlayList + 1)
                    }
                }
            }

            if (event.key === "Enter") {
                if (selectedTrackInPlayList !== null) {
                    event.preventDefault()
                    playTrack(selectedTrackInPlayList)
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
