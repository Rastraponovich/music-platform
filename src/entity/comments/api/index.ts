import { externalAPI } from "@/utils/axiosInstanse"

export const getComments = async (id: number) => await externalAPI.get(`/songs/${id}/comments`)

export const API = { getComments }
