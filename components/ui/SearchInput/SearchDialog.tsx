import React, { memo, FC, useState, FunctionComponent, useEffect } from "react"

import { Dialog, Combobox } from "@headlessui/react"

import { SearchIcon } from "@heroicons/react/outline"
import { Store } from "effector"
import { Song } from "@/features/music/types"
import { useEvent, useStore } from "effector-react"
import { winamp } from "@/features/media/winamp"
import clsx from "clsx"
import UIDialog from "../UIDialog/UIDialog"

interface SearchDialogProps {
    open: boolean
    onClose(): void
    value: string
    onChangeValue: (e: React.ChangeEvent<HTMLInputElement>) => void
    data: Store<Song[]>
}

const SearchDialog = ({ open, onClose, value, onChangeValue, data }: SearchDialogProps) => {
    const handlePlayTrack = useEvent(winamp.selectTrackFromList)
    const songs = useStore(data)

    const [displaySongs, setDisplaySongs] = useState(songs)

    useEffect(() => {
        setDisplaySongs(
            songs.filter(
                (item) =>
                    item.artist.toLowerCase().includes(value.toLowerCase()) ||
                    item.name.toLocaleLowerCase().includes(value.toLocaleLowerCase())
            )
        )
    }, [value])

    return (
        <UIDialog
            open={open}
            onClose={onClose}
            className="fixed inset-0 z-50 overflow-y-auto p-4 pt-[25vh]"
        >
            <Combobox
                value={value}
                // @ts-ignore
                onChange={(track: Song) => {
                    handlePlayTrack(track)
                    onClose()
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
                                        active && "bg-[#0078d7] text-gray-100"
                                    )}
                                >
                                    <span className="font-medium ">{item.artist}</span>
                                    <span className="whitespace-pre font-light ">
                                        - {item.name}
                                    </span>
                                </div>
                            )}
                        </Combobox.Option>
                    ))}
                </Combobox.Options>
            </Combobox>
        </UIDialog>
    )
}

export default memo(SearchDialog)
