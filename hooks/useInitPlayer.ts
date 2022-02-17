import { useEffect } from "react"
import { useEvent } from "effector-react/scope"
import { winamp } from "@/features/media/winamp"

export const useInitPlayer = () => {
    const [init, destroy] = useEvent([winamp.init, winamp.destroy])

    useEffect(() => {
        init()
        console.log("init")

        return () => {
            console.log("destroy")

            destroy()
        }
    }, [])
}
