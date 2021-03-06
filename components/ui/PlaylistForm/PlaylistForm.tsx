import { $songs } from "@/features/music"
import { Song } from "@/features/music/types"
import { Combobox } from "@headlessui/react"
import { SearchIcon } from "@heroicons/react/outline"
import clsx from "clsx"
import { useStore } from "effector-react"
import { useState, useEffect, useCallback } from "react"
import Input from "../Input/Input"
import SelectSearch from "../SelectSearch/SelectSearch"
import PlaylistFormTrack from "./PlaylistFormTrack"

const PlaylistForm = () => {
    const songs = useStore($songs)
    const [isOpenedValues, setIsOpenedValues] = useState<boolean>(false)
    const [searchValue, setSearchValue] = useState("")
    const [selectedSongs, setSelectedSongs] = useState<Song[]>([])
    const [displaySongs, setDisplaySongs] = useState(songs)

    const selectSong = useCallback(
        (song: Song) => {
            const isExistSong = selectedSongs.find((item) => item.id === song.id)

            if (isExistSong) {
                return setSelectedSongs(selectedSongs.filter((item) => item.id !== song.id))
            }
            setSelectedSongs([...selectedSongs, song])
        },
        [selectedSongs]
    )

    useEffect(() => {
        if (searchValue !== "") {
            setIsOpenedValues(true)
        }
        return () => setIsOpenedValues(false)
    }, [searchValue, isOpenedValues])

    useEffect(() => {
        setDisplaySongs(
            songs.filter(
                (item) =>
                    item.artist.toLowerCase().includes(searchValue.toLowerCase()) ||
                    item.name.toLocaleLowerCase().includes(searchValue.toLocaleLowerCase())
            )
        )
        return () => setDisplaySongs([])
    }, [searchValue, songs])

    const handleSearch = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            setSearchValue(e.target.value)
        },
        [searchValue]
    )

    const handleToggleValues = useCallback(
        () => setIsOpenedValues((prev) => !prev),
        [isOpenedValues]
    )

    return (
        <form className="flex flex-col space-y-4 py-2 px-4">
            <Input title="????????????????" placeholder="?????????? ????????????????..." required />

            <h3 className="mb-2 text-base font-semibold first-letter:uppercase">???????????????? ????????</h3>
            <div className="grid grid-cols-2 gap-4 rounded border border-black/30 p-2">
                <div className="flex flex-col space-y-2">
                    <span className="font-semibold first-letter:uppercase">?????????? ??????????</span>
                    <SelectSearch
                        value={searchValue}
                        onChangeValue={handleSearch}
                        onChange={selectSong}
                        Icon={<SearchIcon className="group mr-2 h-6 w-6 text-gray-500" />}
                        isOpened={isOpenedValues}
                        onClick={handleToggleValues}
                    >
                        {isOpenedValues &&
                            displaySongs.map((item) => (
                                <PlaylistFormTrack song={item} key={item.id} />
                            ))}
                    </SelectSearch>
                </div>

                <div className="flex flex-col space-y-2">
                    <span className="font-semibold first-letter:uppercase">?????????????????? ??????????</span>
                    <div className="flex flex-col  divide-y divide-gray-100">
                        {selectedSongs.map((item) => (
                            <div
                                key={item.id}
                                className={"space-x-1 bg-gray-200 p-2 text-xs text-gray-900"}
                            >
                                <span className="font-medium ">{item.artist}</span>
                                <span className="whitespace-pre font-light ">- {item.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </form>
    )
}

export default PlaylistForm
