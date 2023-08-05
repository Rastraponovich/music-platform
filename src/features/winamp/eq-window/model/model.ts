import { TWinampWindow } from "@/features/music/types";
import { eq, winampStates } from "@/src/widgets/winamp";
import { createEvent, createStore, sample, split } from "effector";
import { condition } from "patronum";

//TODO: описать JSDoc

/**
 *
 */
export const $minimized = createStore<boolean>(false).on(eq.$minimized, (_, state) => state);

/**
 *
 */
export const $visibled = createStore<boolean>(true).on(eq.$visibleEQ, (_, state) => state);

/**
 *
 */
export const $enabledAutoEQ = createStore<boolean>(true).on(eq.$auto, (_, state) => state);

/**
 *
 */
const toggleAutoEQ = createEvent();

sample({
  clock: toggleAutoEQ,
  target: eq.toggleAutoEQ,
});

/**
 *
 */
export const $enabledEQ = createStore<boolean>(true).on(eq.$enabled, (_, state) => state);

/**
 *
 */
const toggleEnabledEQ = createEvent();

condition({
  source: toggleEnabledEQ,
  if: $enabledEQ,
  then: eq.disableClickedEQ,
  else: eq.enableClickedEQ,
});

/**
 *
 */
const toggleMinimized = createEvent();

sample({
  clock: toggleMinimized,
  target: eq.toggleMinimized,
});

/**
 *
 */
const closeEQ = createEvent();
sample({
  clock: closeEQ,
  target: eq.toggleVisibleEQ,
});

const changedWindowState = createEvent<TWinampWindow>();
sample({
  clock: changedWindowState,
  target: winampStates.changeWindowState,
});

export const actions = {
  closeEQ,
  toggleAutoEQ,
  toggleMinimized,
  toggleEnabledEQ,
  changedWindowState,
};
