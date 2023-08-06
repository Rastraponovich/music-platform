import { toggle } from "@/utils/utils";
import { createEvent, createStore } from "effector";

// events//
export const toggleSidebar = createEvent();
export const setOpenedSidebar = createEvent<boolean>();

// stores //
export const $openedSidebar = createStore<boolean>(false);

// runtime //
$openedSidebar.on(toggleSidebar, toggle);
$openedSidebar.on(setOpenedSidebar, (_, payload) => payload);
