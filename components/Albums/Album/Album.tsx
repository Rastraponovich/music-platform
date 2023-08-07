import { Album } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { memo } from "react";

interface AlbumProps {
  album: Album;
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
        <span className="bage-lg indicator-center badge indicator-item z-10 border-green-500 bg-green-500 align-middle duration-200 group-hover:border-green-600 group-hover:bg-green-600 sm:indicator-end sm:indicator-top">
          новый
        </span>

        <Image
          src={`/images/${album.backgroundImage}`}
          layout="fill"
          objectFit="contain"
          alt="album-cover"
        />
      </div>

      <div className="flex flex-col space-y-2 p-3">
        <span className="bage-lg  badge badge-accent">{album.content}</span>

        <h3 className="text-xl font-semibold first-letter:uppercase">{album.title}</h3>

        {/* album.id -- ссылка */}
        <Link href={`/playlists/${album.id}`} shallow>
          <a className="btn btn-secondary btn-sm no-animation self-start">перейти</a>
        </Link>
      </div>
    </article>
  );
};

export default memo(AlbumComponent);
