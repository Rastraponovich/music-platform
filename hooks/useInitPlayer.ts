import { useEffect } from "react"
import { useEvent } from "effector-react/scope"
import { destroyPlayer, initPlayer } from "@/features/music/player"

export const useInitPlayer = () => {
    const [init, destroy] = useEvent([initPlayer, destroyPlayer])
    useEffect(() => {
        init()
        return () => {
            destroy()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
}
