import type { ResetStateKey } from "./model";

export const CHANGE_ALL_BANDS_EVENT: Record<ResetStateKey, number> = {
  min: 0,
  max: 100,
  reset: 50,
};

export const WINDOW_NAME = "EQUALIZER";

export const WIDE_SPRITE = 15;
export const TALL_SPRITE = 65;
export const OFFSET = 14;
export const SPRITE_ELEMENT_OFFSET = 27;

export const GRAPH_HEIGHT = 19;
export const GRAPH_WIDTH = 113;
