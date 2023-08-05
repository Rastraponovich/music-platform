import { AxiosResponse } from "axios"
import { createEffect } from "effector"
import { API } from "../api"
import type { TComment } from "../lib"

export const getCommentsFx = createEffect<number, AxiosResponse<TComment[]>, Error>(API.getComments)
