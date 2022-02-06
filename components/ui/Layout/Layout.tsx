import AsidePlayer from "@/components/AsidePlayer/AsidePlayer"
import { player } from "@/features/music/player"
import { useStore } from "effector-react"
import Head from "next/head"
import Image from "next/image"
import Link from "next/link"
import { memo, FC, ReactNode } from "react"
import PlayList from "../PlayList/PlayList"

interface LayoutProps {
    title?: string
    children: ReactNode
}

const Layout: FC<LayoutProps> = ({ title, children }) => {
    console.log("render layout")
    const currentTrack = useStore(player.$currentTrack)

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
            {currentTrack && <AsidePlayer />}
            <PlayList />

            {/* <MobileNavPanel />
        <Footer /> */}
        </>
    )
}

export default memo(Layout)
