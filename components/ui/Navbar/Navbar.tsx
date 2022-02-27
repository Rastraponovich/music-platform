import clsx from "clsx"
import Link from "next/link"

interface NavbarProps {}

const Navbar = ({}: NavbarProps) => {
    return (
        <nav
            className={clsx(
                "md:col-span-5   md:flex md:flex-row md:items-center md:space-x-4",
                "col-span-3 col-end-13 hidden flex-col justify-center  overflow-hidden text-center text-base"
            )}
        >
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
    )
}

export default Navbar
