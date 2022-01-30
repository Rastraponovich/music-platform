import Head from "next/head"
import Link from "next/link"
import React, { memo, FC, ReactNode } from "react"

interface LayoutProps {
    title?: string
    children: ReactNode
}

const Layout: FC<LayoutProps> = ({ title, children }) => {
    return (
        <>
            <Head>
                <title>Музыкалка {title}</title>
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
            </Head>
            <header className="grid w-full grid-cols-12 content-center items-center px-8 py-4 ">
                <Link href="/" shallow>
                    <a className="col-span-3 text-xl">Музыкалка</a>
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
                    <a className="col-span-3">Музыкалка</a>
                </Link>
            </footer>
            {/* <MobileNavPanel />
        <Footer /> */}
        </>
    )
}

export default memo(Layout)
