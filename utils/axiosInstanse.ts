import axios from "axios"

const externalAPI = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND,
    withCredentials: true,
})
const iternalAPI = axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_HOST}/api`,
    withCredentials: true,
})

export { externalAPI, iternalAPI }
