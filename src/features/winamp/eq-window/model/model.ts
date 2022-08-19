import { eq } from "@/features/media/winamp"
import { createStore } from "effector"

export const $minimized = createStore<boolean>(false).on(eq.$minimized, (_, state) => state)
export const $visibled = createStore<boolean>(true).on(eq.$visibleEQ, (_, state) => state)

// export const $bands = useStore(eq.$bands)
// export const $preamp = useStore(eq.$preamp)
