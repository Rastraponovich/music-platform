import { createTrackFactory } from "@/features/music/player"
import { Song } from "@/features/music/types"
import { useMemo } from "react"

export const useTrack = (track: Song) => {
    const factoryTrack = createTrackFactory(track)

    return useMemo(() => factoryTrack, [track])
}
