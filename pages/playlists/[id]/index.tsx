import AlbumInfo from "@/components/Albums/Album/AlbumInfo"
import AlbumInfoItem from "@/components/Albums/Album/AlbumInfoItem"
import PlaylistFormModal from "@/components/ui/PlaylistForm/PlaylistFormModal"
import { Album } from "@/types"
import { albums } from "@/utils/__mock__"
import { allSettled, fork, serialize } from "effector"
import { GetServerSideProps, NextPage } from "next"
import Image from "next/image"

interface PlaylistPageProps {
    playlist: Album
}

const albumInfo = {
    year: 1999,
    tracks: 10,
    genre: "rock",
    duration: "01:45:00",
    rating: 5,
}

const PlaylistPage: NextPage<PlaylistPageProps> = ({ playlist }) => {
    return (
        <main className="grow space-y-4 px-20 pb-5 pt-1">
            <h2 className="text-2xl font-semibold">Плейлист</h2>
            <div className="flex">
                <PlaylistFormModal />
            </div>

            <section>
                <h2>{playlist.title}</h2>
                <div className="flex space-x-2">
                    <Image src={`/images/${playlist.backgroundImage}`} height={160} width={160} />
                    <AlbumInfo albumProps={albumInfo} />
                </div>
                <h4>Список треков</h4>
                <div className="flex flex-col">
                    {playlist?.tracks ? (
                        playlist?.tracks.map((track) => <div key={track.id}>{track.name}</div>)
                    ) : (
                        <h3>Пусто</h3>
                    )}
                </div>
            </section>
        </main>
    )
}

export default PlaylistPage

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
    const scope = fork()

    const playlist = albums.find((item) => item.id === Number(params!.id))

    // await allSettled(getPlaylists, { scope })

    return {
        props: {
            initialState: serialize(scope),
            playlist,
        },
    }
}
