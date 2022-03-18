import { Nullable } from "@/types"
import { createEvent, createStore } from "effector"
import { VISUALIZERS, VISUALIZER_ORDER } from "../music/constants"
import { DummyVizData, TVISUALIZER } from "../music/types"

const toggleVisualizerStyle = createEvent()

const $visualizerStyle = createStore<TVISUALIZER>(VISUALIZERS.BAR).on(
    toggleVisualizerStyle,
    (state, _) => {
        const currentState = VISUALIZER_ORDER.findIndex((item) => item === VISUALIZERS[state])
        if (currentState === VISUALIZER_ORDER.length - 1) return VISUALIZER_ORDER[0]
        return VISUALIZER_ORDER[currentState + 1]
    }
)

const $dummyVizData = createStore<Nullable<DummyVizData>>(null)

export { $visualizerStyle, $dummyVizData, toggleVisualizerStyle }
