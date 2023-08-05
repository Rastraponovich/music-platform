import { createEvent, createStore } from "effector";
import { VISUALIZERS, VISUALIZER_ORDER } from "../music/constants";

import type { Nullable } from "@/types";
import type { DummyVizData, VisualizerKey } from "../music/types";

const toggleVisualizerStyle = createEvent();

const $visualizerStyle = createStore<VisualizerKey>(VISUALIZERS.BAR);
const $dummyVizData = createStore<Nullable<DummyVizData>>(null);

$visualizerStyle.on(toggleVisualizerStyle, (currentStyle) => {
  const currentState = VISUALIZER_ORDER.findIndex((item) => item === VISUALIZERS[currentStyle]);

  if (currentState === VISUALIZER_ORDER.length - 1) return VISUALIZER_ORDER[0];
  return VISUALIZER_ORDER[currentState + 1];
});

export { $visualizerStyle, $dummyVizData, toggleVisualizerStyle };
