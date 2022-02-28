import React, { memo, FC } from "react"

interface AlbumInfoItemProps {
    name: string
    value: string | number | boolean
}

const AlbumInfoItem = ({ name, value }: AlbumInfoItemProps) => {
    return (
        <div className="flex justify-between">
            <span className="after:content-[':']">{name}</span>
            <span>{value}</span>
        </div>
    )
}

export default memo(AlbumInfoItem)
