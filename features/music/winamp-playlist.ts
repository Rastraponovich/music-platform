import { Nullable } from "@/types"
import { createEvent, createStore } from "effector"
import { Track } from "./types"

export const createWinampPlaylistFactory = () => {
    const addTrackToPlaylist = createEvent<Track>()
    const $playlist = createStore<Track[]>([]).on(addTrackToPlaylist, (tracks, track) => [
        ...tracks,
        track,
    ])

    const $playlistLength = $playlist.map((state) => state.length)

    const selectTrackInPlaylist = createEvent<number>()
    const $selectedTrackInPlaylist = createStore<Nullable<number>>(null).on(
        selectTrackInPlaylist,
        (_, trackIndex) => trackIndex
    )

    const doubleClickedTrackInPlaylist = createEvent<number>()

    const setCurrentPlayedTrackIndex = createEvent<number>()

    const $currentPlayedTrackIndex = createStore<Nullable<number>>(null)
        .on(doubleClickedTrackInPlaylist, (_, id) => id)
        .on(setCurrentPlayedTrackIndex, (_, id) => id)

    const $durationTracksInPlaylist = createStore<number>(0).on($playlist, (_, tracks) => {
        let initDuration = 0
        const currentDuration = tracks.reduce(
            (acc, current) => acc + current.metaData.format.duration,
            initDuration
        )
        return currentDuration
    })

    const toggleVisiblePlaylist = createEvent()
    const $visiblePlaylist = createStore<boolean>(false).on(
        toggleVisiblePlaylist,
        (state, _) => !state
    )

    const $removedTrackIndex = createStore<Nullable<number>>(null).reset([
        doubleClickedTrackInPlaylist,
        setCurrentPlayedTrackIndex,
    ])

    return {
        $playlist,
        addTrackToPlaylist,
        $playlistLength,
        $selectedTrackInPlaylist,
        selectTrackInPlaylist,
        doubleClickedTrackInPlaylist,
        $currentPlayedTrackIndex,
        setCurrentPlayedTrackIndex,
        $durationTracksInPlaylist,
        $visiblePlaylist,
        toggleVisiblePlaylist,
        $removedTrackIndex,
    }
}
