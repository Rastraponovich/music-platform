import { changeClutterBar } from "@/features/media/winamp"
import { createEvent, sample } from "effector"

export const changedClutterBar = createEvent<string>()

sample({
    clock: changedClutterBar,
    target: changeClutterBar,
})
