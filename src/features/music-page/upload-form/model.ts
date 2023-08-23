import { combine, createEffect, createEvent, createStore, sample } from "effector";
import { and, not, reset } from "patronum";

enum ErrorText {
  Name = "Название трека не должно быть пустым",
  Artist = "Имя исполнителя не должно быть пустым",
}

export const nameChanged = createEvent<string>();
export const artistChanged = createEvent<string>();
export const uploadedCover = createEvent<File>();
export const uploadedAudio = createEvent<File>();
export const formSubmitted = createEvent();
export const toggledModal = createEvent();
export const formReseted = createEvent();

export const $artist = createStore("");
export const $name = createStore("");
export const $audioFile = createStore<File | null>(null);
export const $coverFile = createStore<File | null>(null);
export const $nameErrorText = createStore("");
export const $artistErrorText = createStore("");
export const $modalOpened = createStore(false);

$modalOpened.on(toggledModal, (opened) => !opened);

$artist.on(artistChanged, (_, artist) => artist);
$name.on(nameChanged, (_, name) => name);

$nameErrorText.reset(nameChanged);
$artistErrorText.reset(artistChanged);

const $nameError = $name.map((name) => name.length === 0);
const $artistError = $artist.map((artist) => artist.length === 0);

$coverFile.on(uploadedCover, (_, file) => file);

//validation

export const $newSong = combine({
  name: $name,
  artist: $artist,
  audioFile: $audioFile,
  coverFile: $coverFile,
});

sample({
  clock: formSubmitted,
  source: $newSong,
  filter: and(not($nameError), not($artistError)),
  target: createEffect((payload: unknown) => {
    console.log(payload);
  }),
});

sample({
  clock: formSubmitted,
  filter: $nameError,
  fn: () => ErrorText.Name,
  target: $nameErrorText,
});

sample({
  clock: formSubmitted,
  filter: $artistError,
  fn: () => ErrorText.Artist,
  target: $artistErrorText,
});

$modalOpened.reset(formReseted);

reset({
  clock: [$modalOpened.map((opened) => !opened)],
  target: [$name, $artist, $audioFile, $coverFile, $nameErrorText, $artistErrorText],
});
