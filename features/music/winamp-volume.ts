import { ChangeEvent } from "react";
import { createEffect, createEvent, createStore, sample, Store } from "effector";

import type { Nullable } from "@/types";
import type { MediaElement } from "./types";

const createWinampVolumeFactory = ($Media: Store<Nullable<MediaElement>>) => {
  const keyboardChangedVolumeFx = createEffect<
    { media: Nullable<MediaElement>; key: string },
    void
  >(({ media, key }) => {
    if (media) {
      media._audio.volume = key === "up" ? media._audio.volume + 0.01 : media._audio.volume - 0.01;
    }
  });

  const changeVolumeFx = createEffect<
    { audio: HTMLAudioElement; event: ChangeEvent<HTMLInputElement> },
    void
  >(({ audio, event }) => {
    audio.volume = Number(event.target.value) / 100;
  });

  const VolumeChanged = createEvent<ChangeEvent<HTMLInputElement>>();
  const keyboardVolumeChanged = createEvent<string>();
  const setVolume = createEvent<number>();

  const $volume = createStore<number>(50);

  $volume.on(setVolume, (_, volume) => volume);

  /**
   * when volume changed by keyboard
   */
  sample({
    clock: keyboardVolumeChanged,
    source: $Media,
    fn: (media, key) => ({ media, key }),
    target: keyboardChangedVolumeFx,
  });

  /**
   * when volume changed by mouse
   */
  sample({
    clock: VolumeChanged,
    source: $Media,
    filter: (media) => media?._audio instanceof HTMLAudioElement,
    fn: (media, event) => ({ audio: media!._audio, event }),
    target: changeVolumeFx,
  });

  return {
    $volume,
    setVolumeFromKeys: keyboardVolumeChanged,
    changeVolume: VolumeChanged,
    setVolume,
  };
};

export { createWinampVolumeFactory };
