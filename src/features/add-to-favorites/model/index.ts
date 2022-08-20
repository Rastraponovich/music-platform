import { songModel } from "@/src/entity/songs"
import { createEvent, sample } from "effector"

export const addTofavoritesButtonClicked = createEvent<number>()

sample({
    clock: addTofavoritesButtonClicked,
    fn: (id) => id,
    target: songModel.actions.addToFavoriteButtonClicked,
})
