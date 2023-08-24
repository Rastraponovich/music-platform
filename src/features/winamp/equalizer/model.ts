import { createEvent, createStore, sample } from "effector";
import { reset } from "patronum";
import type { ChangeEvent } from "react";
import { WINAMP_STATE } from "~/entity/winamp";

import { PRESETS, PRESETS_ARRAY } from "@/features/music/constants";
import type { Band, TPreset } from "@/features/music/types";
import {
  $winampState,
  changePreampFx,
  loadPresetEQFx,
  resetEqBandFx,
  setAllBandsEqFx,
  setEQbandFx,
  setMarqueInfo,
  toggleEQFx,
} from "@/src/widgets/winamp";
import type { Nullable } from "@/types";
import { getSnapBandValue, toggle } from "@/utils/utils";

import { generateEQBandMarqueText, generatePreampMarqueText, setAllBands } from "./utils";

export type ResetStateKey = "max" | "min" | "reset";

//turn off EQ in UI
export const disableClickedEQ = createEvent();
export const loadPreset = createEvent();
export const resetPreamp = createEvent();
export const toggleAutoEQ = createEvent();
export const resetAllBands = createEvent();
export const toggleVisibleEQ = createEvent();
export const toggleMinimizeEQ = createEvent();
export const selectPreset = createEvent<TPreset>();
export const toggleVisiblePresetWindow = createEvent();
export const setBand = createEvent<Record<Band, number>>();

//ui change preamp slider value
export const changePreampValue = createEvent<ChangeEvent<HTMLInputElement>>();

//ui change EQ Band
export const changeEQBand = createEvent<ChangeEvent<HTMLInputElement>>();

// turn on EQ in UI
export const enableClickedEQ = createEvent();

//ui doubleclick in eqband
export const resetEqBand = createEvent<string>();

//set MAX/MIN/RESET all BANDS in UI
export const changeAllBandsValues = createEvent<ResetStateKey>();

//------------STORES--------------//

export const $preamp = createStore(50);
export const $autoEQ = createStore(false);
export const $enabledEQ = createStore(true);
export const $visibleEQ = createStore(false);

export const $minimizedEQ = createStore(false);
export const $visiblePresetWindow = createStore(false);
export const $presets = createStore<TPreset[]>(PRESETS_ARRAY);
export const $selectedPreset = createStore<Nullable<TPreset>>(null);
export const $currentPreset = createStore<TPreset>(PRESETS.DEFAULT);
export const $bands = createStore<Record<Band, number>>(PRESETS.DEFAULT.value);

$autoEQ.on(toggleAutoEQ, toggle);
$visibleEQ.on(toggleVisibleEQ, toggle);
$minimizedEQ.on(toggleMinimizeEQ, toggle);
$visiblePresetWindow.on(toggleVisiblePresetWindow, toggle);

$bands.on(setBand, (bands, band) => ({ ...bands, ...band }));
$bands.reset(resetAllBands);

$preamp.reset(resetPreamp);

$selectedPreset.on(selectPreset, (_, preset) => preset);

sample({
  clock: changeEQBand,
  fn: ({ target: { name, value } }) => ({ name, value }),
  target: setEQbandFx,
});

sample({
  clock: resetEqBand,
  fn: (name) => ({ name }),
  target: resetEqBandFx,
});

sample({
  clock: changeAllBandsValues,
  fn: (key) => ({ key }),
  target: setAllBandsEqFx,
});

$bands.on(setAllBandsEqFx.doneData, setAllBands);

sample({
  clock: changePreampValue,
  fn: ({ target }) => ({ value: getSnapBandValue(Number(target.value)) }),
  target: changePreampFx,
});

$preamp.on(changePreampFx.doneData, (_, preampValue) => preampValue);

sample({
  clock: $currentPreset,
  fn: (preset) => ({ preset }),
  target: loadPresetEQFx,
});

sample({
  clock: loadPreset,
  source: $selectedPreset,
  filter: (preset) => !!preset,
  fn: (preset) => preset!,
  target: $currentPreset,
});

// change preamp marque text

sample({
  clock: changePreampValue,
  fn: (event) => generatePreampMarqueText(event.target.value),
  target: setMarqueInfo,
});

//

// change eq band marque text

sample({
  clock: changeEQBand,
  fn: ({ target }) => generateEQBandMarqueText(target.value, target.name),
  target: setMarqueInfo,
});

// visibled window

sample({
  clock: $winampState,
  filter: (state) =>
    state === WINAMP_STATE.CLOSED ||
    state === WINAMP_STATE.MINIMIZED ||
    state === WINAMP_STATE.DESTROYED,
  fn: () => false,
  target: $visibleEQ,
});

sample({
  clock: $winampState,
  filter: (state) => state === WINAMP_STATE.OPENED || state === WINAMP_STATE.TRACKLOADED,
  fn: () => true,
  target: $visibleEQ,
});

// refactor to one effect and event from here ==>

sample({
  clock: disableClickedEQ,
  source: $enabledEQ,
  fn: (enabled) => ({ enable: !enabled }),
  target: toggleEQFx,
});

sample({
  clock: enableClickedEQ,
  source: $enabledEQ,
  fn: (enabled) => ({ enable: !enabled }),
  target: toggleEQFx,
});

$enabledEQ.on(toggleEQFx.done, toggle);

// <== to here

sample({
  clock: [resetEqBandFx.doneData, setEQbandFx.doneData, loadPresetEQFx.doneData],
  target: setBand,
});

//
reset({
  clock: $currentPreset,
  target: [$visiblePresetWindow, $selectedPreset],
});
