import Auth from "@/components/Auth/Auth"
import useStickyHeader from "@/hooks/useStickyHeader"
import clsx from "clsx"
import Image from "next/image"
import Link from "next/link"
import React, { memo, FC } from "react"
import LoginFormModal from "../LoginForm/LoginFormModal"

const Header = () => {
    // const { ref, isSticky } = useStickyHeader()

    return (
        <header
            // ref={ref}
            className={clsx(
                // isSticky && "fixed",
                "grid w-full grid-cols-12 content-center items-center px-8 py-4 shadow-none transition-[box-shadow] duration-500 ease-in-out hover:shadow-lg"
            )}
        >
            <Link href="/" shallow>
                <a className="col-span-3 flex items-center text-xl">
                    <Image src="/img/winamp-logo.svg" height={50} width={50} alt="Лого" />
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
            <Auth />
        </header>
    )
}

export default Header
