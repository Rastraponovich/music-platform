import Album from "@/components/Albums/Album/Album"
import AlbumsList from "@/components/Albums/AlbumsList"
import Layout from "@/components/ui/Layout/Layout"
import PlaylistFormModal from "@/components/ui/PlaylistForm/PlaylistFormModal"
import { $playlists, getPlaylists } from "@/features/playlist"
import { albums } from "@/utils/__mock__"
import { allSettled, fork, serialize } from "effector"
import { useList, useStore } from "effector-react"
import { GetServerSideProps } from "next"
import React, { memo, FC, useMemo } from "react"

interface PlaylistPageProps {}

const PlaylistPage: FC<PlaylistPageProps> = () => {
    const playlists = useStore($playlists)

    const memoPlaylist = useMemo(() => albums, [albums])

    return (
        <main className="grow space-y-4 px-20 pb-5 pt-1">
            <h2 className="text-2xl font-semibold">Плейлисты</h2>
            <div className="flex">
                <PlaylistFormModal />
            </div>
            <section className="grid grid-cols-3 content-start gap-4 py-5">
                {memoPlaylist.map((item) => (
                    <Album album={item} key={item.id} />
                ))}
            </section>

            <section className="grid grid-cols-3 gap-4">
                {useList($playlists, { fn: (pl) => <div>{pl.name}</div> })}
            </section>
        </main>
    )
}

export default PlaylistPage

export const getServerSideProps: GetServerSideProps = async () => {
    const scope = fork()

    // await allSettled(getPlaylists, { scope })

    return {
        props: {
            initialState: serialize(scope),
        },
    }
}
