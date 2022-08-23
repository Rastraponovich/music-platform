import { winamp } from "@/features/media/winamp"
import { sample, createEvent } from "effector"

export const toggleTimeModeButtonClicked = createEvent()

sample({
    clock: toggleTimeModeButtonClicked,
    target: winamp.toggleTimeMode,
})
