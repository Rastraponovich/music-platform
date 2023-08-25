import { createEvent, createStore } from "effector";

import { toggle } from "@/utils/utils";

// events//
export const toggleSidebar = createEvent();
export const setOpenedSidebar = createEvent<boolean>();

// stores //
export const $openedSidebar = createStore(false);

// runtime //
$openedSidebar.on(toggleSidebar, toggle);
$openedSidebar.on(setOpenedSidebar, (_, payload) => payload);
