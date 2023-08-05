import { winamp } from "@/src/widgets/winamp/model"
import { TMediaStatus } from "@/features/music/types"
import { createStore } from "effector"
import { useStore } from "effector-react"

export const $playing = createStore<TMediaStatus>("STOPPED").on(
    winamp.$mediaStatus,
    (_, status) => status
)

const useIsPlaying = () => useStore($playing)
export const selectors = {
    useIsPlaying,
}
