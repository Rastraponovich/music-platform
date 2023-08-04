import { CalendarIcon, ClockIcon, MusicNoteIcon } from "@heroicons/react/outline"
import { UserIcon } from "@heroicons/react/solid"
import { memo } from "react"
import AlbumInfoItem from "./AlbumInfoItem"

type TAlbumInfo = {
    createdDate: string
    tracks: number
    genre: string
    duration: string
    rating: number
    author: string
}

interface AlbumInfoProps {
    albumProps: TAlbumInfo
}

const AlbumInfo = ({ albumProps }: AlbumInfoProps) => {
    return (
        <div className="col-span-3 col-start-8 flex flex-col divide-y-2 divide-gray-200 rounded bg-white  p-2 text-sm">
            <AlbumInfoItem
                name={<CalendarIcon className="h-6 w-6" />}
                value={albumProps.createdDate}
            />
            <AlbumInfoItem name={<UserIcon className="h-6 w-6" />} value={albumProps.author} />
            <AlbumInfoItem name={<MusicNoteIcon className="h-6 w-6" />} value={albumProps.tracks} />
            <AlbumInfoItem
                name={<ClockIcon className="h-6 w-6 align-middle" />}
                value={albumProps.duration}
            />
        </div>
    )
}

export default memo(AlbumInfo)
