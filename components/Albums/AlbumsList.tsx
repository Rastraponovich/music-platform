import { albums } from "@/utils/__mock__"
import { useMemo } from "react"
import Album from "./Album/Album"

interface AlbumsListProps {}

const AlbumsList = () => {
    const memoAlbums = useMemo(() => albums, [albums])

    return (
        <div className="grid items-center gap-4 sm:grid-cols-1 md:grid-cols-2">
            {memoAlbums.map((album) => (
                <Album key={album.id} album={album} />
            ))}
        </div>
    )
}

export default AlbumsList
