import clsx from "clsx";
import { useList, useUnit } from "effector-react";
import { Fragment, memo } from "react";
import type { Song } from "~/entity/songs";

import { SelectSearch } from "@/components/ui/select-search";

import { Button } from "~/shared/ui/button";
import { ModalActions, ModalTitle } from "~/shared/ui/dialog";
import { Input } from "~/shared/ui/input";

import {
  $dropDownIsOpened,
  $filteredSongs,
  $modalIsOpened,
  $name,
  $searchString,
  $songsSelected,
  modalToggled,
  nameChanged,
  searchChanged,
  songSelected,
  toggledDropdown,
} from "./model";

import { Combobox, Dialog, Transition } from "@headlessui/react";
import { DocumentAddIcon, SearchIcon } from "@heroicons/react/outline";

export const PlaylistForm = () => {
  const [isOpenedValues, handleToggleValues] = useUnit([$dropDownIsOpened, toggledDropdown]);
  const [search, handleSearch] = useUnit([$searchString, searchChanged]);
  const handleSelectSong = useUnit(songSelected);

  return (
    <form className="flex flex-col space-y-4 py-2 px-4" id="playlist-create-form">
      <FormName />

      <h3 className="mb-2 text-base font-semibold first-letter:uppercase">Добавить трек</h3>
      <div className="grid grid-cols-2 gap-4 rounded border border-black/30 p-2">
        <div className="flex flex-col space-y-2">
          <span className="font-semibold first-letter:uppercase">поиск трека</span>
          <SelectSearch
            value={search}
            onChangeValue={(e) => handleSearch(e.target.value)}
            onChange={handleSelectSong}
            Icon={<SearchIcon className="group mr-2 h-6 w-6 text-gray-500" />}
            isOpened={isOpenedValues}
            onClick={handleToggleValues}
          >
            {isOpenedValues && <DropdownSongsList />}
          </SelectSearch>
        </div>

        <SelectedSongsList />
      </div>
    </form>
  );
};

interface PlaylistFormTrackProps {
  song: Song;
}

export const PlaylistFormTrack = memo<PlaylistFormTrackProps>(({ song }) => {
  return (
    <Combobox.Option value={song}>
      {({ active }) => (
        <div
          className={clsx(
            "cursor-pointer space-x-1 px-4 py-2 text-gray-900 ",
            active && "bg-[#0078d7] text-gray-100",
          )}
        >
          <span className="font-medium ">{song.artist}</span>
          <span className="whitespace-pre font-light ">- {song.name}</span>
        </div>
      )}
    </Combobox.Option>
  );
});

PlaylistFormTrack.displayName = "PlaylistFormTrack";

export const PlaylistFormModal = () => {
  const [isOpened, handleToggleModal] = useUnit([$modalIsOpened, modalToggled]);

  return (
    <>
      <Button
        className="btn-xs gap-2 hover:shadow-lg"
        onClick={handleToggleModal}
        title="создать плейлист"
      >
        <DocumentAddIcon className="h-3 w-3 rounded-full bg-white p-[2px] text-gray-900" />
        создать плейлист
      </Button>

      <Transition show={isOpened} as={Fragment}>
        <Dialog
          open={isOpened}
          onClose={handleToggleModal}
          className="fixed inset-0 z-50 overflow-y-auto p-4 pt-[10vh]"
        >
          <Transition.Child
            as={Fragment}
            enter="transition duration-200 ease-out"
            enterFrom="transform opacity-0"
            enterTo="transform opacity-100"
            leave="transition duration-150 ease-out"
            leaveFrom="transform opacity-100"
            leaveTo="transform opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-gray-500/75" />
          </Transition.Child>

          <Transition.Child
            as={Fragment}
            enter="transition duration-200 ease-out"
            enterFrom="transform scale-75 opacity-0"
            enterTo="transform scale-100 opacity-100"
            leave="transition duration-150 ease-out"
            leaveFrom="transform scale-100 opacity-100"
            leaveTo="transform scale-75 opacity-0"
          >
            <div className=" relative mx-auto flex max-w-xl flex-col rounded bg-white shadow-lg">
              <ModalTitle>Новый плейлист</ModalTitle>

              <PlaylistForm />
              <ModalActions>
                <Button
                  className="btn-sm"
                  variant="error"
                  onClick={handleToggleModal}
                  type="reset"
                  form="playlist-create-form"
                >
                  Отмена
                </Button>
                <Button
                  className="btn-sm"
                  variant="success"
                  onClick={handleToggleModal}
                  type="submit"
                  form="playlist-create-form"
                >
                  сохранить
                </Button>
              </ModalActions>
            </div>
          </Transition.Child>
        </Dialog>
      </Transition>
    </>
  );
};

const FormName = () => {
  const [name, handleNameChange] = useUnit([$name, nameChanged]);

  return (
    <Input
      title="Название"
      placeholder="Новый плейлист..."
      required
      value={name}
      onChange={(e) => handleNameChange(e.target.value)}
    />
  );
};

// TODO: Refactor
const DropdownSongsList = () => {
  return (
    <div>
      {useList($filteredSongs, {
        getKey: (item) => item.id!,
        keys: [],
        fn: (song) => <PlaylistFormTrack song={song} />,
      })}
    </div>
  );
};

const SelectedSongsList = () => {
  return (
    <div className="flex flex-col space-y-2">
      <span className="font-semibold first-letter:uppercase">Выбранные треки</span>
      <div className="flex flex-col  divide-y divide-gray-100">
        {useList($songsSelected, {
          getKey: (item) => item.id!,
          keys: [],
          fn: (songSelected) => (
            <div className={"space-x-1 bg-gray-200 p-2 text-xs text-gray-900"}>
              <span className="font-medium ">{songSelected.artist}</span>
              <span className="whitespace-pre font-light ">- {songSelected.name}</span>
            </div>
          ),
        })}
      </div>
    </div>
  );
};
