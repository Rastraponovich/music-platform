import { Album } from "@/types"
import Image from "next/image"
import Link from "next/link"
import React, { memo, FC } from "react"

interface AlbumProps {
    album: Album
}

const AlbumComponent = ({ album }: AlbumProps) => {
    return (
        <article className=" group  flex flex-col space-y-3 rounded shadow-lg hover:shadow-xl">
            <div
                className="indicator relative h-[200px] w-full rounded-t bg-gray-200"
                // style={{
                //     backgroundImage: `url(/images/${album.backgroundImage})`,
                //     objectFit: "cover",
                //     backdropFilter: "{blur: 50}",
                // }}
            >
                <span className="bage-lg indicator-item badge z-10 border-green-500 bg-green-500 align-middle duration-200 group-hover:border-green-600 group-hover:bg-green-600">
                    новый
                </span>

                <Image src={`/images/${album.backgroundImage}`} layout="fill" objectFit="contain" />
            </div>

            <div className="flex flex-col space-y-2 p-3">
                <span className="bage-lg  badge badge-accent">{album.content}</span>

                <h3 className="text-xl font-semibold first-letter:uppercase">{album.title}</h3>

                {/* album.id -- ссылка */}
                <Link href={`/playlists/${album.id}`} shallow>
                    <a className="btn btn-secondary no-animation btn-sm self-start">перейти</a>
                </Link>
            </div>
        </article>
    )
}

export default memo(AlbumComponent)
