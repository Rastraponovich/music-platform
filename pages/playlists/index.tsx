import Layout from "@/components/ui/Layout/Layout"
import { $playlists, getPlaylists } from "@/features/playlist"
import { allSettled, fork, serialize } from "effector"
import { useList, useStore } from "effector-react"
import { GetServerSideProps } from "next"
import React, { memo, FC } from "react"

interface PlaylistPageProps {}

const PlaylistPage: FC<PlaylistPageProps> = () => {
    const playlists = useStore($playlists)

    return (
        <Layout title="Плейлисты">
            <main className="grow">
                <h2>добро пожаловать</h2>

                <section className="grid grid-cols-3 gap-4">
                    {useList($playlists, { fn: (pl) => <div>{pl.name}</div> })}
                </section>
            </main>
        </Layout>
    )
}

export default PlaylistPage

export const getServerSideProps: GetServerSideProps = async () => {
    const scope = fork()

    await allSettled(getPlaylists, { scope })

    return {
        props: {
            initialState: serialize(scope),
        },
    }
}
