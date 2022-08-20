import { TResponse } from "@/types"
import { AxiosResponse } from "axios"
import { createEffect } from "effector"

import { API, Song } from "../lib"

export const searchTrackFx = createEffect<string, AxiosResponse<any>, Error>(API.searchTrackAPI)

export const getMetadataFx = createEffect<string, AxiosResponse<any>, Error>(API.getMetadataAPI)

export const getAllSongsFx = createEffect<any, AxiosResponse<TResponse<Song>>, Error>(
    API.getAllSongsAPI
)

export const saveSongFx = createEffect<
    Song & { image: File; music: File },
    AxiosResponse<Song>,
    Error
>(API.saveSongAPI)

export const getOneSongFx = createEffect<number, AxiosResponse<Song>, Error>(API.getOneSongAPI)

export const updateSongFx = createEffect<{ id: number; song: Song }, AxiosResponse<Song>, Error>(
    API.updateSongAPI
)

export const deleteOneSongFx = createEffect<number, AxiosResponse<Song>, Error>(
    API.deleteOneSongAPI
)
