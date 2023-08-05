import { Nullable } from "@/types";
import { createEffect, createEvent, createStore, guard, sample, Store } from "effector";
import { ChangeEvent } from "react";
import { MediaElement, _Bands } from "./types";

const createWinampVolumeFactory = ($Media: Store<Nullable<MediaElement>>) => {
  const setVolumeFx = createEffect<[MediaElement, string], void>(([media, type]) => {
    media._audio.volume = type === "up" ? media._audio.volume + 0.01 : media._audio.volume - 0.01;
  });

  //change volume from UI
  const changeVolume = createEvent<ChangeEvent<HTMLInputElement>>();

  const setVolume = createEvent<number>();
  const $volume = createStore<number>(50).on(setVolume, (_, volume) => volume);

  const setVolumeFromKeys = createEvent<string>();

  sample({
    clock: setVolumeFromKeys,
    source: $Media,
    fn: (media, value) => [media, value] as [MediaElement, string],
    target: setVolumeFx,
  });
  guard({
    source: sample({
      clock: changeVolume,
      source: $Media,
      fn: (media, event) => [media?._audio, event],
    }),
    filter: (sourceTuple): sourceTuple is [HTMLAudioElement, ChangeEvent<HTMLInputElement>] =>
      sourceTuple[0] instanceof HTMLAudioElement,
    target: createEffect<[HTMLAudioElement, ChangeEvent<HTMLInputElement>], void>(
      ([audio, event]) => {
        audio.volume = Number(event.target.value) / 100;
      },
    ),
  });

  return {
    $volume,
    setVolumeFromKeys,
    changeVolume,
    setVolume,
  };
};

export { createWinampVolumeFactory };
