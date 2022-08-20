import { useInitPlayer } from "@/hooks/useInitPlayer"
import { ReactNode } from "react"

interface InitPlayerProps {
    children: ReactNode
}

export const InitPlayer = ({ children }: InitPlayerProps) => {
    useInitPlayer()

    return <>{children}</>
}
