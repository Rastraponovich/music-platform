import { $songs } from "@/features/music"
import { SearchIcon } from "@heroicons/react/outline"
import React, { memo, FC, useState, useEffect } from "react"
import UIDialog from "../UIDialog/UIDialog"

const SearchInput = () => {
    const [isOpen, setIsOpen] = useState(false)
    const [searchValue, setSearchValue] = useState("")

    useEffect(() => {
        if (searchValue !== "") {
            setIsOpen(true)
        }
    }, [searchValue])
    return (
        <label className="mb-4 flex flex-col space-y-2">
            <span>Поиск по названию</span>
            <UIDialog
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
                    className="w-full rounded text-sm text-gray-800 placeholder:text-gray-400 placeholder:first-letter:uppercase focus:outline-none"
                    value={searchValue}
                    onClick={() => setIsOpen(true)}
                />
            </div>
        </label>
    )
}

export default SearchInput
