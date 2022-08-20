import { TResponse } from "@/types"
import { AxiosResponse } from "axios"
import { createEffect } from "effector"
import { songLib } from ".."

export const searchTrackFx = createEffect<string, AxiosResponse<any>, Error>(
    songLib.API.searchTrackAPI
)

export const getMetadataFx = createEffect<string, AxiosResponse<any>, Error>(
    songLib.API.getMetadataAPI
)

export const getAllSongsFx = createEffect<any, AxiosResponse<TResponse<songLib.Song>>, Error>(
    songLib.API.getAllSongsAPI
)

export const saveSongFx = createEffect<
    songLib.Song & { image: File; music: File },
    AxiosResponse<songLib.Song>,
    Error
>(songLib.API.saveSongAPI)

export const getOneSongFx = createEffect<number, AxiosResponse<songLib.Song>, Error>(
    songLib.API.getOneSongAPI
)

export const updateSongFx = createEffect<
    { id: number; song: songLib.Song },
    AxiosResponse<songLib.Song>,
    Error
>(songLib.API.updateSongAPI)

export const deleteOneSongFx = createEffect<number, AxiosResponse<songLib.Song>, Error>(
    songLib.API.deleteOneSongAPI
)
