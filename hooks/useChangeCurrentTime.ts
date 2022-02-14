import { progress } from "@/features/media/winamp"
import { player } from "@/features/music/player"
import { useEvent } from "effector-react"
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

export default useChangeCurentTime
