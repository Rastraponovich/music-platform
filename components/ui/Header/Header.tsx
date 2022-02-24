import Image from "next/image"
import Link from "next/link"
import React, { memo, FC } from "react"

const Header = () => {
    return (
        <header className="grid w-full grid-cols-12 content-center items-center px-8 py-4 shadow-none transition-[box-shadow] duration-500 ease-in-out hover:shadow-lg">
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
            <div className="col-span-3 col-end-13 flex  space-x-2 text-xs">
                <button className="rounded bg-gray-400/80 px-2 py-1 uppercase">войти</button>
                <button className="rounded bg-gray-400/80 px-2 py-1 uppercase">
                    зарегистрироватся
                </button>
            </div>
        </header>
    )
}

export default Header
