import { externalAPI } from "@/utils/axiosInstanse"
import axios from "axios"
import { songLib } from ".."

export const getMetadataAPI = async (name: string) => {
    return await externalAPI.get(`api/songs/metadata/${name}`, { withCredentials: false })
}

export const getAllSongsAPI = async (params?: any) => {
    return await externalAPI.get("api/songs", { params: { take: 10 } })
}

export const searchTrackAPI = async (params: any) => {
    return axios.get("http://localhost:3000/api/songs?name=" + params)
}

export const getOneSongAPI = async (id: number) => await externalAPI.get(`api/songs/${id}`)

export const deleteOneSongAPI = async (id: number) => await externalAPI.delete(`api/songs/${id}`)

export const saveSongAPI = async (song: songLib.Song & { image: File; music: File }) => {
    const formdata = new FormData()
    Object.entries(song).forEach(([key, value], index) => formdata.append(key, value))
    const response = await externalAPI.post("api/songs", formdata)
    return response
}
export const updateSongAPI = async ({ id, song }: { id: number; song: songLib.Song }) =>
    await externalAPI.patch(`/songs/${id}`, song)
