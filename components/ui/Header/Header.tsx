import Auth from "@/components/Auth/Auth"
import useStickyHeader from "@/hooks/useStickyHeader"
import { MenuIcon } from "@heroicons/react/solid"
import clsx from "clsx"
import Image from "next/image"
import Link from "next/link"
import React, { memo, FC } from "react"
import Button from "../Button/Button"
import LoginFormModal from "../LoginForm/LoginFormModal"
import Navbar from "../Navbar/Navbar"

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
            <Navbar />
            <Auth />
            <Button className="btn-ghost btn-circle col-end-13  hover:text-white md:hidden">
                <MenuIcon className="h-8 w-8" />
            </Button>
        </header>
    )
}

export default Header
