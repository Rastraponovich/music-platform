import { createEvent, createStore, sample } from "effector";
import { reset } from "patronum";
import type { Band } from "~/entity/songs";
import { WINAMP_STATE } from "~/entity/winamp";

import type { Nullable } from "@/types";
import { getSnapBandValue } from "@/utils/utils";

import {
  $winampState,
  changePreampFx,
  loadPresetEQFx,
  resetEqBandFx,
  setAllBandsEqFx,
  setEQbandFx,
  setMarqueInfo,
  toggleEQFx,
} from "~/widgets/winamp";

import { PRESETS, PRESETS_ARRAY } from "./constants";
import { generateEQBandMarqueText, generatePreampMarqueText, setAllBands } from "./utils";

export type ResetStateKey = "max" | "min" | "reset";

export type Preset = {
  name: PresetNames;
  value: Record<Band, number>;
};

export type PresetNames =
  | "ROCK"
  | "DEFAULT"
  | "TECHNO"
  | "CLASSIC"
  | "CLUB"
  | "FULL BASS"
  | "FULL BASS AND TREBBLE";

//turn off EQ in UI
export const disableClickedEQ = createEvent();
export const loadPreset = createEvent();
export const resetPreamp = createEvent();
export const toggleAutoEQ = createEvent();
export const resetAllBands = createEvent();
export const toggleVisibleEQ = createEvent();
export const toggleMinimizeEQ = createEvent();
export const selectPreset = createEvent<Preset>();
export const toggleVisiblePresetWindow = createEvent();
export const setBand = createEvent<Record<Band, number>>();

//ui change preamp slider value
export const changePreampValue = createEvent<string>();

//ui change EQ Band
export const changeEQBand = createEvent<{ name: string; value: string }>();

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
export const $presets = createStore<Preset[]>(PRESETS_ARRAY);
export const $selectedPreset = createStore<Nullable<Preset>>(null);
export const $currentPreset = createStore<Preset>(PRESETS.DEFAULT);
export const $bands = createStore<Record<Band, number>>(PRESETS.DEFAULT.value);

$autoEQ.on(toggleAutoEQ, (autoEq) => !autoEq);
$visibleEQ.on(toggleVisibleEQ, (visible) => !visible);
$minimizedEQ.on(toggleMinimizeEQ, (minimized) => !minimized);
$visiblePresetWindow.on(toggleVisiblePresetWindow, (presetVisible) => !presetVisible);

$bands.on(setBand, (bands, band) => ({ ...bands, ...band }));
$bands.reset(resetAllBands);

$preamp.reset(resetPreamp);

$selectedPreset.on(selectPreset, (_, preset) => preset);

sample({
  clock: changeEQBand,
  fn: ({ name, value }) => ({ name, value }),
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
  fn: (preampValue) => ({ value: getSnapBandValue(Number(preampValue)) }),
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
  fn: (preampValue) => generatePreampMarqueText(preampValue),
  target: setMarqueInfo,
});

//

// change eq band marque text

sample({
  clock: changeEQBand,
  fn: ({ name, value }) => generateEQBandMarqueText(value, name),
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

sample({
  clock: [enableClickedEQ, disableClickedEQ],
  source: $enabledEQ,
  fn: (enabled) => ({ enable: !enabled }),
  target: toggleEQFx,
});

$enabledEQ.on(toggleEQFx.done, (enabled) => !enabled);

sample({
  clock: [resetEqBandFx.doneData, setEQbandFx.doneData, loadPresetEQFx.doneData],
  target: setBand,
});

//
reset({
  clock: $currentPreset,
  target: [$visiblePresetWindow, $selectedPreset],
});
