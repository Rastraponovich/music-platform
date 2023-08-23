import clsx from "clsx";
import { useUnit } from "effector-react";

import { Modal } from "~/shared/ui/dialog";

import {
  $filteredSongs,
  $isOpened,
  $searchString,
  closed,
  opened,
  searchChanged,
  songSelected,
} from "./model";

import { Combobox } from "@headlessui/react";
import { SearchIcon } from "@heroicons/react/outline";

export const SearchInput = () => {
  const handleOpen = useUnit(opened);

  const [searchValue, handleSearch] = useUnit([$searchString, searchChanged]);

  return (
    <label className="mb-4 flex flex-col space-y-2">
      <SearchDialog />

      <div className=" flex items-center rounded bg-white px-4">
        <SearchIcon className="group mr-2 h-6 w-6 text-gray-500" />
        <input
          type="text"
          placeholder="поиск трека"
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full rounded py-2 text-sm text-gray-800 placeholder:text-gray-400 placeholder:first-letter:uppercase focus:outline-none"
          value={searchValue}
          onClick={handleOpen}
        />
      </div>
    </label>
  );
};

export const SearchDialog = () => {
  const [search, handleValueChange] = useUnit([$searchString, searchChanged]);
  const [isOpened, handleClose] = useUnit([$isOpened, closed]);

  const filteredSongs = useUnit($filteredSongs);

  const handleSongSelect = useUnit(songSelected);

  return (
    <Modal
      open={isOpened}
      onClose={handleClose}
      className="fixed inset-0 z-50 overflow-y-auto p-4 pt-[25vh]"
    >
      <Combobox
        value={search}
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        onChange={handleSongSelect}
        as="div"
        className="relative mx-auto max-w-xl divide-y divide-gray-100 overflow-hidden rounded bg-white shadow-2xl ring-1 ring-black/5"
      >
        <div className=" flex items-center px-4">
          <SearchIcon className="group mr-2 h-6 w-6 text-gray-500" />
          <Combobox.Input
            className="h-12 w-full border-0 bg-transparent text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-0"
            placeholder="Поиск..."
            onChange={(e) => handleValueChange(e.target.value)}
          />
        </div>

        <Combobox.Options static className="max-h-40 overflow-y-auto text-sm">
          {filteredSongs.map((song) => (
            <Combobox.Option value={song} key={song.name}>
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
          ))}
        </Combobox.Options>
      </Combobox>
    </Modal>
  );
};
