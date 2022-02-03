import { $songs } from "@/features/music"
import { player } from "@/features/music/player"
import clsx from "clsx"
import { useStore } from "effector-react"
import { useEvent } from "effector-react/scope"
import Head from "next/head"
import Image from "next/image"
import Link from "next/link"
import React, { memo, FC, ReactNode, useState } from "react"
import AudioPlayer from "../AudioPlayer/AudioPlayer"

interface LayoutProps {
    title?: string
    children: ReactNode
}

const Layout: FC<LayoutProps> = ({ title, children }) => {
    const songs = useStore($songs)
    const currentTrack = useStore(player.$currentTrack)
    const duration = useStore(player.$duration)

    const handleChangeProgress = useEvent(player.progress.changeProgress)
    const [hidden, setHidden] = useState(false)

    const progress = useStore(player.progress.$pgorgress)
    return (
        <>
            <Head>
                <title>Музыкалка {title}</title>
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
            </Head>
            <header className="grid w-full grid-cols-12 content-center items-center px-8 py-4 ">
                <Link href="/" shallow>
                    <a className="col-span-3 flex items-center text-xl">
                        <Image src="/img/winamp-logo.svg" height={50} width={50} />
                        <h2>Шinamp</h2>
                    </a>
                </Link>
                <nav className=" col-span-5 flex items-center  space-x-4 text-center text-base">
                    <Link href="/music" shallow>
                        <a>музыка</a>
                    </Link>
                    <Link href="/playlists" shallow>
                        <a>подборки</a>
                    </Link>
                    <Link href="/authors" shallow>
                        <a>исполнители</a>
                    </Link>
                </nav>
                <div className="col-span-3 col-end-13 flex  space-x-2 text-xs">
                    <button className="rounded bg-gray-400/80 px-2 py-1 uppercase">войти</button>
                    <button className="rounded bg-gray-400/80 px-2 py-1 uppercase">
                        зарегистрироватся
                    </button>
                </div>
            </header>
            {/* <Header /> */}
            {children}
            <aside></aside>
            <footer className="grid grid-cols-12 items-center bg-gray-400 px-8 py-4 text-xl">
                <Link href="/" shallow>
                    <a className="col-span-3 flex items-center text-xl">
                        <Image src="/img/winamp-logo.svg" height={50} width={50} />
                        <h2>Шinamp</h2>
                    </a>
                </Link>
            </footer>
            {currentTrack && (
                <aside
                    className={clsx(
                        "fixed bottom-4 left-[10%] right-[10%] rounded bg-white px-10  shadow-md",
                        hidden && "max-h-8 overflow-hidden"
                    )}
                >
                    <button
                        className="absolute  right-0 -top-10 bg-green-600 p-4"
                        onClick={() => setHidden((prev) => !prev)}
                    >
                        hide
                    </button>
                    <div className={clsx(hidden && "hidden")}>
                        <AudioPlayer track={currentTrack} />
                    </div>

                    {hidden && (
                        <input
                            type="range"
                            min={0}
                            max={duration}
                            value={progress}
                            onChange={handleChangeProgress}
                            className="w-full max-w-[calc(100%-2rem)]"
                        />
                    )}
                </aside>
            )}

            {/* <MobileNavPanel />
        <Footer /> */}
        </>
    )
}

export default memo(Layout)
