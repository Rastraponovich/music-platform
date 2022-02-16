import { useEffect } from "react"
import { useEvent } from "effector-react/scope"
import { destroyPlayer, initPlayer } from "@/features/music/player"
import { winamp } from "@/features/media/winamp"

export const useInitPlayer = () => {
    const [init, destroy] = useEvent([winamp.init, winamp.destroy])

    useEffect(() => {
        init()
        console.log("init")

        // return () => destroy()
    }, [])
}
