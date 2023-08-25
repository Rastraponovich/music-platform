import type { MouseEventHandler } from "react";

import { AudioState } from "./constants";
import type { Song } from "./model";

export type AudioStates = Record<string, AudioState>;

export type Band = 60 | 170 | 310 | 600 | 1000 | 3000 | 6000 | 12000 | 14000 | 16000;

export type TWinampState =
  | "DESTROYED"
  | "CREATED"
  | "INIT"
  | "TRACKLOADED"
  | "CLOSED"
  | "OPENED"
  | "MINIMIZED";

export type MediaStatus = "PLAYING" | "STOPPED" | "PAUSED";

export type WinampWindow = "PLAYER" | "EQUALIZER" | "PLAYLIST" | "NONE" | "PRESETS";

export type UseDraggblePosition = {
  clientX: string | number;
  clientY: string | number;
};
export type UseDraggbleReturnProps = [
  onDragStart: MouseEventHandler,
  onDragging: MouseEventHandler,
  onDragEnd: MouseEventHandler,
];

export interface Track extends Song {}

export interface StereoBalanceNodeType extends AudioNode {
  // eslint-disable-next-line @typescript-eslint/no-misused-new
  constructor(context: AudioContext): StereoBalanceNodeType;
  balance: {
    value: number;
  };
}

export type _Bands = { [key in Band]: BiquadFilterNode };

export type MediaElement = {
  _context: AudioContext;
  _staticSource: GainNode;
  _balance: StereoBalanceNodeType;
  _preamp: GainNode;
  _analyser: AnalyserNode;
  _gainNode: GainNode;
  _audio: HTMLAudioElement;
  _source: MediaElementAudioSourceNode;
  _bands: _Bands;
};

export type TPreset = {
  name: PresetTypes;
  value: Record<Band, number>;
};

export type PresetTypes =
  | "ROCK"
  | "DEFAULT"
  | "TECHNO"
  | "CLASSIC"
  | "CLUB"
  | "FULL BASS"
  | "FULL BASS AND TREBBLE";
