import React, { memo, ReactNode } from "react"

interface AlbumInfoItemProps {
    name: string | ReactNode
    value: string | number | boolean | ReactNode
}

const AlbumInfoItem = ({ name, value }: AlbumInfoItemProps) => {
    return (
        <div className="flex items-center justify-between">
            <span>{name}</span>
            <span className="flex items-center">{value}</span>
        </div>
    )
}

export default memo(AlbumInfoItem)
