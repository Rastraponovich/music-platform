import { albums } from "@/utils/__mock__"
import Album from "./Album/Album"

const AlbumsList = () => {
    return (
        <div className="grid items-center gap-4 sm:grid-cols-1 md:grid-cols-2">
            {albums.map((album) => (
                <Album key={album.id} album={album} />
            ))}
        </div>
    )
}

export default AlbumsList
