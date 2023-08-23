import Image from "next/image";
import Link from "next/link";
import { ReactNode, memo } from "react";

import type { Album } from "@/types";

import { ALBUMS } from "./constants";

import { CalendarIcon, ClockIcon, MusicNoteIcon } from "@heroicons/react/outline";
import { UserIcon } from "@heroicons/react/solid";

interface AlbumInfoItemProps {
  name: string | ReactNode;
  value: string | number | boolean | ReactNode;
}

export const ALBUMSList = () => {
  return (
    <div className="grid items-center gap-4 sm:grid-cols-1 md:grid-cols-2">
      {ALBUMS.map((album) => (
        <AlbumComponent key={album.id} album={album} />
      ))}
    </div>
  );
};

interface AlbumProps {
  album: Album;
}

export const AlbumComponent = memo<AlbumProps>((props) => {
  const { album } = props;

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
});

AlbumComponent.displayName = "AlbumComponent";

type TAlbumInfo = {
  createdDate: string;
  tracks: number;
  genre: string;
  duration: string;
  rating: number;
  author: string;
};

interface AlbumInfoProps {
  albumProps: TAlbumInfo;
}

export const AlbumInfo = memo<AlbumInfoProps>(({ albumProps }) => {
  return (
    <div className="col-span-3 col-start-8 flex flex-col divide-y-2 divide-gray-200 rounded bg-white  p-2 text-sm">
      <AlbumInfoItem name={<CalendarIcon className="h-6 w-6" />} value={albumProps.createdDate} />
      <AlbumInfoItem name={<UserIcon className="h-6 w-6" />} value={albumProps.author} />
      <AlbumInfoItem name={<MusicNoteIcon className="h-6 w-6" />} value={albumProps.tracks} />
      <AlbumInfoItem
        name={<ClockIcon className="h-6 w-6 align-middle" />}
        value={albumProps.duration}
      />
    </div>
  );
});

AlbumInfo.displayName = "AlbumInfo";

const AlbumInfoItem = memo<AlbumInfoItemProps>(({ name, value }) => {
  return (
    <div className="flex items-center justify-between">
      <span>{name}</span>
      <span className="flex items-center">{value}</span>
    </div>
  );
});

AlbumInfoItem.displayName = "AlbumInfoItem";
