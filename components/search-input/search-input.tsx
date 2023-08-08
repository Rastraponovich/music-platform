import clsx from "clsx";
import type { Store } from "effector";
import { useUnit } from "effector-react";
import { ChangeEventHandler, memo, useEffect, useState } from "react";

import { $songs } from "@/features/music";
import type { Song } from "@/features/music/types";
import { winamp } from "@/src/widgets/winamp/model";

import { Modal } from "~/shared/ui/dialog";

import { Combobox } from "@headlessui/react";
import { SearchIcon } from "@heroicons/react/outline";

export const SearchInput = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    if (searchValue !== "") {
      setIsOpen(true);
    }
  }, [searchValue]);
  return (
    <label className="mb-4 flex flex-col space-y-2">
      <SearchDialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        value={searchValue}
        onChangeValue={(e) => setSearchValue(e.target.value)}
        data={$songs}
      />

      <div className=" flex items-center rounded bg-white px-4">
        <SearchIcon className="group mr-2 h-6 w-6 text-gray-500" />
        <input
          type="text"
          placeholder="поиск трека"
          onChange={(e) => setSearchValue(e.target.value)}
          className="w-full rounded py-2 text-sm text-gray-800 placeholder:text-gray-400 placeholder:first-letter:uppercase focus:outline-none"
          value={searchValue}
          onClick={() => setIsOpen(true)}
        />
      </div>
    </label>
  );
};

interface SearchDialogProps {
  open: boolean;
  onClose(): void;
  value: string;
  onChangeValue: ChangeEventHandler<HTMLInputElement>;
  data: Store<Song[]>;
}

export const SearchDialog = memo<SearchDialogProps>(
  ({ open, onClose, value, onChangeValue, data }) => {
    const handlePlayTrack = useUnit(winamp.selectTrackFromList);
    const songs = useUnit(data);

    const [displaySongs, setDisplaySongs] = useState(songs);

    useEffect(() => {
      setDisplaySongs(
        songs.filter(
          (item) =>
            item.artist.toLowerCase().includes(value.toLowerCase()) ||
            item.name.toLocaleLowerCase().includes(value.toLocaleLowerCase()),
        ),
      );
    }, [value, songs]);

    return (
      <Modal
        open={open}
        onClose={onClose}
        className="fixed inset-0 z-50 overflow-y-auto p-4 pt-[25vh]"
      >
        <Combobox
          value={value}
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          onChange={(track: Song) => {
            handlePlayTrack(track);
            onClose();
          }}
          as="div"
          className="relative mx-auto max-w-xl divide-y divide-gray-100 overflow-hidden rounded bg-white shadow-2xl ring-1 ring-black/5"
        >
          <div className=" flex items-center px-4">
            <SearchIcon className="group mr-2 h-6 w-6 text-gray-500" />
            <Combobox.Input
              className="h-12 w-full border-0 bg-transparent text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-0"
              placeholder="Поиск..."
              onChange={onChangeValue}
            />
          </div>

          <Combobox.Options static className="max-h-40 overflow-y-auto text-sm">
            {displaySongs.map((item) => (
              <Combobox.Option value={item} key={item.name}>
                {({ active }) => (
                  <div
                    className={clsx(
                      "cursor-pointer space-x-1 px-4 py-2 text-gray-900 ",
                      active && "bg-[#0078d7] text-gray-100",
                    )}
                  >
                    <span className="font-medium ">{item.artist}</span>
                    <span className="whitespace-pre font-light ">- {item.name}</span>
                  </div>
                )}
              </Combobox.Option>
            ))}
          </Combobox.Options>
        </Combobox>
      </Modal>
    );
  },
);

SearchDialog.displayName = "SearchDialog";
