import { sample, createEvent, createStore, createEffect } from "effector"
import { ChangeEvent } from "react"

import type { IComments, TComment } from "../lib"
import { getCommentsFx } from "./api"

export const $comments = createStore<IComments>({}).on(getCommentsFx.doneData, (state, res) => {
    const trackId = res.data[0].songId
    return { ...state, [trackId]: res.data }
})

export const getComments = createEvent<number>()

sample({
    clock: getComments,
    target: getCommentsFx,
})

interface INewComment {
    [key: number]: TComment
}
const $newComment = createStore<INewComment>({})

const setNewComment = createEvent<ChangeEvent<HTMLInputElement>>()

sample({
    clock: setNewComment,
    source: $newComment,
    fn: (target, event) => {
        const { id, value } = event.target
        return { ...target, [id]: { ...target[Number(id)], text: value } }
    },
    target: $newComment,
})

const submittedComment = createEvent<number>()
const submittedCommentFx = createEffect<number, number, Error>()

sample({
    clock: submittedComment,
    target: submittedCommentFx,
})

sample({
    clock: submittedCommentFx.doneData,

    source: $newComment,
    fn: (target, id) => {
        const { [id]: old, ...result } = target
        return result
    },
    target: $newComment,
})
