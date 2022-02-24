import Head from "next/head"
import Image from "next/image"
import Link from "next/link"
import { memo, ReactNode } from "react"
import Header from "../Header/Header"

interface LayoutProps {
    children: ReactNode
}

const Layout = ({ children }: LayoutProps) => {
    console.log("render layout")

    return (
        <>
            <Head>
                <title>Музыкалка </title>
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
            </Head>

            <Header />
            {children}

            <footer className="grid grid-cols-12 items-center bg-gray-400 px-8 py-4 text-xl">
                <Link href="/" shallow>
                    <a className="col-span-3 flex items-center text-xl">
                        <Image src="/img/winamp-logo.svg" height={50} width={50} alt="Лого" />
                        <h2>Шinamp</h2>
                    </a>
                </Link>
            </footer>

            {/* <MobileNavPanel />
        <Footer /> */}
        </>
    )
}

export default memo(Layout)
