import { Store, createEffect, scopeBind, createEvent, sample, createStore } from "effector";
import { reset } from "patronum";

import { getClientScope } from "@/hooks/useScope";
import { getSnapBandValue } from "@/utils/utils";

import type { ChangeEvent } from "react";
import type { Nullable } from "@/types";
import type { MediaElement, _Bands, Band, TPreset } from "./types";

import { PRESETS, PRESETS_ARRAY } from "./constants";

const CHANGE_ALL_BANDS_EVENT: Record<string, number> = {
  min: 0,
  max: 100,
  reset: 50,
};

const toggle = (state: boolean): boolean => !state;

// const calculateGainValueBandEQ = (value: number) => {
//   const db = (value / 100) * 24 - 12;
//   const gainValue = Math.pow(10, db / 20);

//   return gainValue;
// };

// const calculatePercentFromBandEQ = (gain:number = 4.8) => {
//     gain = (value / 100) * 24 - 12
//     const gainValue = Math.pow(10, db / 20)

//     return gainValue
// }

export const createWinampEQFactory = ($Media: Store<Nullable<MediaElement>>) => {
  const loadPresetFx = createEffect<{ media: Nullable<MediaElement>; preset: TPreset }, void>(
    ({ media, preset }) => {
      const callSetBandScoped = scopeBind(setBand, { scope: getClientScope()! });

      Object.entries(preset.value).forEach(([key, value]) => {
        const bandName = Number(key) as keyof _Bands;
        const db = (value / 100) * 24 - 12;

        media!._bands[bandName].gain.value = db;

        callSetBandScoped({ [bandName]: value } as Record<Band, number>);
      });
    },
  );

  const enableEQFx = createEffect<MediaElement, void>((media) => {
    media._staticSource.disconnect();
    media._staticSource.connect(media._preamp);

    const callEnabledEQScoped = scopeBind(toggleEnabledEQ, { scope: getClientScope()! });

    callEnabledEQScoped();
  });

  const disableEQFx = createEffect<MediaElement, void>((media) => {
    media._staticSource.disconnect();
    media._staticSource.connect(media._balance);
    const callEnabledEQScoped = scopeBind(toggleEnabledEQ, { scope: getClientScope()! });

    callEnabledEQScoped();
  });

  const resetEqBandFx = createEffect<{ media: Nullable<MediaElement>; name: string }, void>(
    ({ media, name }) => {
      const bandName = Number(name) as keyof _Bands;

      media!._bands[bandName].gain.value = 0;
      const callResetBandScoped = scopeBind(setBand, { scope: getClientScope()! });

      callResetBandScoped({ [bandName]: 50 } as Record<Band, number>);
    },
  );

  const setEQbandFx = createEffect<
    { media: Nullable<MediaElement>; event: ChangeEvent<HTMLInputElement> },
    void
  >(({ media, event }) => {
    const { value, name } = event.target;

    const snapBandValue = getSnapBandValue(Number(value));

    const bandName = Number(name) as keyof _Bands;
    const db = (snapBandValue / 100) * 24 - 12;

    media!._bands[bandName].gain.value = db;

    const callSetBandScoped = scopeBind(setBand, { scope: getClientScope()! });

    callSetBandScoped({ [bandName]: snapBandValue } as Record<Band, number>);
  });

  const changePreampValueFx = createEffect<
    { media: Nullable<MediaElement>; event: ChangeEvent<HTMLInputElement> },
    void
  >(({ media, event }) => {
    const value = getSnapBandValue(Number(event.target.value));
    const db = (value / 100) * 24 - 12;

    media!._preamp.gain.value = Math.pow(10, db / 20);

    const callChangePreampScoped = scopeBind(setPreamp, { scope: getClientScope()! });

    callChangePreampScoped(value);
  });

  const setAllBandsEqFx = createEffect<{ media: Nullable<MediaElement>; event: string }, void>(
    ({ media, event }) => {
      let db = 0;

      switch (event) {
        case "max":
          db = 12;
          break;

        case "min":
          db = -12;
          break;

        case "reset":
          db = 0;
          break;

        default:
          break;
      }
      Object.entries(media!._bands).forEach(([_, band]) => {
        band.gain.value = db;
      });
      const callChangeAllBandsScoped = scopeBind(changeAllBands, { scope: getClientScope()! });

      callChangeAllBandsScoped(event);
    },
  );

  //turn off EQ in UI
  const disableClickedEQ = createEvent();
  const loadPreset = createEvent();
  const resetPreamp = createEvent();
  const toggleAutoEQ = createEvent();
  const resetAllBands = createEvent();
  const toggleVisibleEQ = createEvent();
  const toggleEnabledEQ = createEvent();
  const toggleMinimizeEQ = createEvent();
  const setPreamp = createEvent<number>();
  const selectPreset = createEvent<TPreset>();
  const changeAllBands = createEvent<string>();
  const toggleVisiblePresetWindow = createEvent();
  const setBand = createEvent<Record<Band, number>>();

  // turn on EQ in UI
  const enableClickedEQ = createEvent();

  //ui change EQ Band
  const changeEQBand = createEvent<ChangeEvent<HTMLInputElement>>();

  //ui doubleclick in eqband
  const resetEqBand = createEvent<string>();

  //set MAX/MIN/RESET all BANDS in UI
  const changeAllBandsValues = createEvent<string>();

  //ui change preamp slider value
  const changePreampValue = createEvent<ChangeEvent<HTMLInputElement>>();

  //------------STORES--------------//

  const $preamp = createStore(50);
  const $autoEQ = createStore(false);
  const $enabledEQ = createStore(true);
  const $visibleEQ = createStore(false);
  const $minimizedEQ = createStore(false);
  const $visiblePresetWindow = createStore(false);
  const $presets = createStore<TPreset[]>(PRESETS_ARRAY);
  const $selectedPreset = createStore<Nullable<TPreset>>(null);
  const $currentPreset = createStore<TPreset>(PRESETS.DEFAULT);
  const $bands = createStore<Record<Band, number>>(PRESETS.DEFAULT.value);

  $autoEQ.on(toggleAutoEQ, toggle);
  $enabledEQ.on(toggleEnabledEQ, toggle);
  $visibleEQ.on(toggleVisibleEQ, toggle);
  $minimizedEQ.on(toggleMinimizeEQ, toggle);
  $visiblePresetWindow.on(toggleVisiblePresetWindow, toggle);

  $bands.on(setBand, (bands, band) => ({ ...bands, ...band }));
  $bands.reset(resetAllBands);

  $bands.on(changeAllBands, (bands, event) => {
    const bandValue = Object.hasOwn(CHANGE_ALL_BANDS_EVENT, event)
      ? CHANGE_ALL_BANDS_EVENT[event]
      : 0;

    let copyBands: Record<Band, number> = { ...bands };

    Object.entries(bands).forEach(([key, _]) => {
      copyBands = { ...copyBands, [key]: bandValue };
    });

    return copyBands;
  });

  $preamp.on(setPreamp, (_, newPreamp) => newPreamp);
  $preamp.reset(resetPreamp);

  $selectedPreset.on(selectPreset, (_, preset) => preset);

  sample({
    clock: disableClickedEQ,
    source: $Media,
    filter: (media): media is MediaElement => media?._audio instanceof HTMLAudioElement,
    target: disableEQFx,
  });

  sample({
    clock: enableClickedEQ,
    source: $Media,
    filter: (media): media is MediaElement => media?._audio instanceof HTMLAudioElement,
    target: enableEQFx,
  });

  sample({
    clock: changeEQBand,
    source: $Media,
    fn: (media, event) => ({ media, event }),
    target: setEQbandFx,
  });

  sample({
    clock: resetEqBand,
    source: $Media,
    fn: (media, name) => ({ media, name }),
    target: resetEqBandFx,
  });

  sample({
    clock: changeAllBandsValues,
    source: $Media,
    fn: (media, event) => ({ media, event }),
    target: setAllBandsEqFx,
  });

  sample({
    clock: changePreampValue,
    source: $Media,
    fn: (media, event) => ({ media, event }),
    target: changePreampValueFx,
  });

  sample({
    clock: $currentPreset,
    source: $Media,
    fn: (media, preset) => ({ media, preset }),
    target: loadPresetFx,
  });

  sample({
    clock: loadPreset,
    source: $selectedPreset,
    filter: (preset) => !!preset,
    fn: (preset) => preset!,
    target: $currentPreset,
  });

  reset({
    clock: $currentPreset,
    target: [$visiblePresetWindow, $selectedPreset],
  });

  return {
    $bands,
    $autoEQ,
    $preamp,
    $presets,
    $enabledEQ,
    $visibleEQ,
    $minimizedEQ,
    $currentPreset,
    loadPreset,
    resetEqBand,
    toggleAutoEQ,
    changeEQBand,
    enableClickedEQ,
    toggleVisibleEQ,
    disableClickedEQ,
    toggleMinimizeEQ,
    changePreampValue,
    changeAllBandsValues,
    selectPreset,
    $selectedPreset,
    toggleVisiblePresetWindow,
    $visiblePresetWindow,
  };
};
