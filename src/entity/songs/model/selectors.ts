import { useStore } from "effector-react"
import { $countSongs, $favoritesTracks } from "./model"

export const useCountSongs = () => useStore($countSongs)
export const useFavoriteTrack = (id: number | undefined) =>
    useStore($favoritesTracks).some((track) => track === id)
