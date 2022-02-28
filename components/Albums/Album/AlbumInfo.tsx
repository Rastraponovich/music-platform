import Rating from "@/components/ui/Rating/Rating"
import React, { memo, FC } from "react"
import AlbumInfoItem from "./AlbumInfoItem"

type AlbumInfo = {
    year: number
    tracks: number
    genre: string
    duration: string
    rating: number
}

interface AlbumInfoProps {
    albumProps: AlbumInfo
}

const AlbumInfo = ({ albumProps }: AlbumInfoProps) => {
    return (
        <div className="flex w-full flex-col divide-y-2 divide-black rounded border border-black p-2">
            <AlbumInfoItem name="Год" value={albumProps.year} />
            <AlbumInfoItem name="Жанр" value={albumProps.genre} />
            <AlbumInfoItem name="Треков" value={albumProps.tracks} />
            <AlbumInfoItem name="Продолжительность" value={albumProps.duration} />
            <div className="flex justify-between">
                <span className="after:content-[':']">Рейтинг</span>
                <Rating value={albumProps.rating} />
            </div>
        </div>
    )
}

export default memo(AlbumInfo)
