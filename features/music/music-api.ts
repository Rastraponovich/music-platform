import { TResponse } from "@/types"
import { externalAPI } from "@/utils/axiosInstanse"
import axios, { AxiosResponse } from "axios"
import { createEffect } from "effector"
import { Song } from "./types"

const getMetadataAPI = async (name: string) => {
    return await externalAPI.get(`/songs/metadata/${name}`, { withCredentials: false })
}

const getAllSongsAPI = async (params?: any) => {
    return await externalAPI.get("/songs", { params: { take: 10 } })
}

const searchTrackAPI = async (params: any) => {
    return axios.get("http://localhost:4000/songs?name=" + params)
}

const searchTrackFx = createEffect<string, AxiosResponse<any>, Error>(searchTrackAPI)

const getOneSongAPI = async (id: number) => await externalAPI.get(`/songs/${id}`)
const deleteOneSongAPI = async (id: number) => await externalAPI.delete(`/songs/${id}`)

const saveSongAPI = async (song: Song & { image: File; music: File }) => {
    const formdata = new FormData()

    Object.entries(song).forEach(([key, value], index) => formdata.append(key, value))

    const response = await externalAPI.post("/songs", formdata)

    return response
}
const updateSongAPI = async ({ id, song }: { id: number; song: Song }) =>
    await externalAPI.patch(`/songs/${id}`, song)

const getMetadataFx = createEffect<string, AxiosResponse<any>, Error>(getMetadataAPI)

const getAllSongsFx = createEffect<any, AxiosResponse<TResponse<Song>>, Error>(getAllSongsAPI)
const saveSongFx = createEffect<Song & { image: File; music: File }, AxiosResponse<Song>, Error>(
    saveSongAPI
)
const getOneSongFx = createEffect<number, AxiosResponse<Song>, Error>(getOneSongAPI)
const updateSongFx = createEffect<{ id: number; song: Song }, AxiosResponse<Song>, Error>(
    updateSongAPI
)

const deleteOneSongFx = createEffect<number, AxiosResponse<Song>, Error>(deleteOneSongAPI)

const MusicAPI = {
    getAllSongsFx,
    saveSongFx,
    getOneSongFx,
    updateSongFx,
    deleteOneSongFx,
    getMetadataFx,
    searchTrackFx,
}

export { MusicAPI }
