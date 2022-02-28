import clsx from "clsx"
import Link from "next/link"

interface NavbarProps {
    className?: string
}

const Navbar = ({ className }: NavbarProps) => {
    return (
        <nav
            className={clsx(
                className,
                "md:col-span-5 md:flex md:flex-row md:items-center md:space-x-4 md:space-y-0",
                "col-span-3 col-end-13 flex flex-col justify-center  space-y-2 text-center text-base"
            )}
        >
            <Link href="/music" shallow>
                <a className="btn no-animation capitalize first-letter:uppercase md:btn-ghost md:hover:btn-ghost md:hover:underline">
                    музыка
                </a>
            </Link>
            <Link href="/playlists" shallow>
                <a className="btn no-animation capitalize first-letter:uppercase md:btn-ghost md:hover:btn-ghost md:hover:underline">
                    подборки
                </a>
            </Link>
            <Link href="/authors" shallow>
                <a className="btn no-animation capitalize first-letter:uppercase md:btn-ghost md:hover:btn-ghost md:hover:underline">
                    исполнители
                </a>
            </Link>
        </nav>
    )
}

export default Navbar
