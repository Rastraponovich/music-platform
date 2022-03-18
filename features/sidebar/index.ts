import { createEvent, createStore } from "effector"

const toggleSidebar = createEvent()
const setOpenedSidebar = createEvent<boolean>()
const $openedSidebar = createStore<boolean>(false)
    .on(toggleSidebar, (state, _) => !state)
    .on(setOpenedSidebar, (_, payload) => payload)

export { toggleSidebar, $openedSidebar, setOpenedSidebar }
