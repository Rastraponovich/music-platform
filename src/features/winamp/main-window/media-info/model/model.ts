import { marqueInfo, playlist, winamp } from "@/features/media/winamp"
import { Nullable } from "@/types"
import { createStore, sample } from "effector"
import { isLong, MARQUEE_MAX_LENGTH, MINUTE, SEPARATOR } from "../lib"

export const $enabledMarque = createStore<boolean>(false).on(
    marqueInfo.$enabledMaruqeInfo,
    (_, state) => state
)
export const $marqueInfoText = createStore<Nullable<string>>(null).on(
    marqueInfo.$winampMarqueInfo,
    (_, info) => info
)

export const $minute = createStore<Nullable<number>>(null).on(
    winamp.$currentTrack,
    (state, currentTrack) => {
        if (currentTrack !== null) {
            return Math.floor(currentTrack.metaData.format.duration / MINUTE)
        }
        return null
    }
)

export const $second = createStore<Nullable<number>>(null).on(
    winamp.$currentTrack,
    (state, currentTrack) => {
        if (currentTrack !== null) {
            return Math.floor(currentTrack.metaData.format.duration % MINUTE)
        }
        return null
    }
)

const $total = createStore<string>("")

sample({
    clock: $minute,
    source: $second,
    fn: (sec, min) => {
        if (sec && min) {
            return `(${min < 10 ? `0${min}` : min}:${sec < 10 ? `0${sec}` : sec})`
        }
        return ""
    },
    target: $total,
})

const $text = createStore("")

sample({
    clock: winamp.$currentTrack,
    source: [playlist.$currentPlayedTrackIndex, $total],
    //@ts-ignore
    fn: ([currentId, total]: [number, string], currentTrack) => {
        if (currentTrack)
            return `${currentId !== null && currentId + 1}. ${currentTrack.artist} - ${
                currentTrack.name
            }   ${total}`
        return ""
    },
    target: $text,
})

export const $trackName = createStore(SEPARATOR)

sample({
    clock: $text,
    fn: (text) =>
        isLong(text) ? `${text}${SEPARATOR}${text}` : text.padEnd(MARQUEE_MAX_LENGTH, " "),
    target: $trackName,
})

// useEffect(() => {
//     const total =
//     const text = `${currentId !== null && currentId + 1}. ${currentTrack.artist} - ${
//         currentTrack.name
//     }   ${total}`

//     setTrack(isLong(text) ? `${text}${SEPARATOR}${text}` : text.padEnd(MARQUEE_MAX_LENGTH, " "))

//     return () => setpos(1)
// }, [currentId, min, sec, track.length])
