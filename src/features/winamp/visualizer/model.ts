import { createEvent, createStore } from "effector";

import type { Nullable } from "@/types";

import { VISUALIZER_ORDER, Visualizers } from "./constants";

export type VisualizerKey = "OSCILLOSCOPE" | "BAR" | "NONE" | "MILKDROP";

export type DummyVizData = {
  0: 11.75;
  8: 11.0625;
  16: 8.5;
  24: 7.3125;
  32: 6.75;
  40: 6.4375;
  48: 6.25;
  56: 5.875;
  64: 5.625;
  72: 5.25;
  80: 5.125;
  88: 4.875;
  96: 4.8125;
  104: 4.375;
  112: 3.625;
  120: 1.5625;
};

export const toggleVisualizerStyle = createEvent();

export const $visualizerStyle = createStore<VisualizerKey>(Visualizers.BAR);
export const $dummyVizData = createStore<Nullable<DummyVizData>>(null);

$visualizerStyle.on(toggleVisualizerStyle, (currentStyle) => {
  const currentState = VISUALIZER_ORDER.findIndex((item) => item === Visualizers[currentStyle]);

  if (currentState === VISUALIZER_ORDER.length - 1) return VISUALIZER_ORDER[0];
  return VISUALIZER_ORDER[currentState + 1];
});
