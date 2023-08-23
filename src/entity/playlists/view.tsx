import clsx from "clsx";
import { useUnit } from "effector-react";
import { ChangeEvent, Fragment, memo, useCallback, useEffect, useState } from "react";

import { SelectSearch } from "@/components/ui/select-search";
import { $songs } from "@/features/music";
import type { Song } from "@/features/music/types";

import { Button } from "~/shared/ui/button";
import { ModalActions, ModalTitle } from "~/shared/ui/dialog";
import { Input } from "~/shared/ui/input";

import { Combobox, Dialog, Transition } from "@headlessui/react";
import { DocumentAddIcon, SearchIcon } from "@heroicons/react/outline";

export const PlaylistForm = () => {
  const songs = useUnit($songs);
  const [isOpenedValues, setIsOpenedValues] = useState<boolean>(false);
  const [searchValue, setSearchValue] = useState("");
  const [selectedSongs, setSelectedSongs] = useState<Song[]>([]);
  const [displaySongs, setDisplaySongs] = useState(songs);

  const selectSong = useCallback(
    (song: Song) => {
      const isExistSong = selectedSongs.find((item) => item.id === song.id);

      if (isExistSong) {
        return setSelectedSongs(selectedSongs.filter((item) => item.id !== song.id));
      }
      setSelectedSongs([...selectedSongs, song]);
    },
    [selectedSongs],
  );

  useEffect(() => {
    if (searchValue !== "") {
      setIsOpenedValues(true);
    }
    return () => setIsOpenedValues(false);
  }, [searchValue, isOpenedValues]);

  useEffect(() => {
    setDisplaySongs(
      songs.filter(
        (item) =>
          item.artist.toLowerCase().includes(searchValue.toLowerCase()) ||
          item.name.toLocaleLowerCase().includes(searchValue.toLocaleLowerCase()),
      ),
    );
    return () => setDisplaySongs([]);
  }, [searchValue, songs]);

  const handleSearch = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  }, []);

  const handleToggleValues = useCallback(() => setIsOpenedValues((prev) => !prev), []);

  return (
    <form className="flex flex-col space-y-4 py-2 px-4">
      <Input title="Название" placeholder="Новый плейлист..." required />

      <h3 className="mb-2 text-base font-semibold first-letter:uppercase">Добавить трек</h3>
      <div className="grid grid-cols-2 gap-4 rounded border border-black/30 p-2">
        <div className="flex flex-col space-y-2">
          <span className="font-semibold first-letter:uppercase">поиск трека</span>
          <SelectSearch
            value={searchValue}
            onChangeValue={handleSearch}
            onChange={selectSong}
            Icon={<SearchIcon className="group mr-2 h-6 w-6 text-gray-500" />}
            isOpened={isOpenedValues}
            onClick={handleToggleValues}
          >
            {isOpenedValues &&
              displaySongs.map((item) => <PlaylistFormTrack song={item} key={item.id} />)}
          </SelectSearch>
        </div>

        <div className="flex flex-col space-y-2">
          <span className="font-semibold first-letter:uppercase">Выбранные треки</span>
          <div className="flex flex-col  divide-y divide-gray-100">
            {selectedSongs.map((item) => (
              <div key={item.id} className={"space-x-1 bg-gray-200 p-2 text-xs text-gray-900"}>
                <span className="font-medium ">{item.artist}</span>
                <span className="whitespace-pre font-light ">- {item.name}</span>
              </div>
            ))}
          </div>
        </div>
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
  const [isOpened, setIsOpened] = useState<boolean>(false);

  const handleToggleOpened = useCallback(() => {
    setIsOpened((prev) => !prev);
  }, []);

  return (
    <>
      <Button
        className="btn-xs gap-2 hover:shadow-lg"
        onClick={handleToggleOpened}
        title="создать плейлист"
      >
        <DocumentAddIcon className="h-3 w-3 rounded-full bg-white p-[2px] text-gray-900" />
        создать плейлист
      </Button>

      <Transition show={isOpened} as={Fragment}>
        <Dialog
          open={isOpened}
          onClose={handleToggleOpened}
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
                <Button className="btn-sm" variant="error" onClick={handleToggleOpened}>
                  Отмена
                </Button>
                <Button className="btn-sm" variant="success" onClick={handleToggleOpened}>
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
