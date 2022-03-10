import clsx from "clsx"
import Image from "next/image"
import { memo, useState } from "react"
import LoginFormModal from "../ui/LoginForm/LoginFormModal"

interface AuthProps {
    className?: string
}

const Auth = ({ className }: AuthProps) => {
    const [isAuth, setIsAuth] = useState(false)
    return (
        <div
            className={clsx(
                className,
                "flex items-center space-x-2  justify-self-end text-xs md:col-span-2 md:col-end-13 md:flex"
            )}
        >
            {!isAuth && <LoginFormModal />}

            <button className=" online avatar" onClick={() => setIsAuth((prev) => !prev)}>
                <div className="w-12 rounded-full bg-neutral-focus text-neutral-content">
                    <Image src="/avatars/avatar.jpg" height={100} width={100} objectFit="contain" />
                </div>
            </button>
            {isAuth && (
                <div className="flex flex-col text-sm">
                    <span className="font-semibold first-letter:uppercase">добро пожаловать!</span>
                    <span>wilde@bk.ru</span>
                </div>
            )}
        </div>
    )
}

export default memo(Auth)
