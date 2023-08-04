import { changeClutterBar } from "@/src/widgets/winamp"
import { createEvent, sample } from "effector"

export const changedClutterBar = createEvent<string>()

sample({
    clock: changedClutterBar,
    target: changeClutterBar,
})
