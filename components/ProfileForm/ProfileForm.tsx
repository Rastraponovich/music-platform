import { CameraIcon } from "@heroicons/react/outline"
import Image from "next/image"
import { useState } from "react"
import Button from "../ui/Button/Button"
import Input from "../ui/Input/Input"

const ProfileForm = () => {
    const [showSettings, setShowSettings] = useState(false)
    return (
        <section className="grid grid-cols-1 gap-y-4 sm:grid-cols-3 sm:gap-x-4 sm:gap-y-0 ">
            <div className="avatar indicator w-full flex-col items-center justify-center self-start rounded bg-white p-4 shadow-md duration-200 hover:shadow-xl">
                <span className="badge indicator-item border-amber-400 bg-amber-400 drop-shadow-md">
                    супер пидор
                </span>

                <div className="group relative  w-24 rounded-full md:w-48 ">
                    <button className="absolute z-10 flex  h-24 w-24 translate-y-[-100%]  items-center justify-center rounded-full bg-black/60 transition-transform duration-300 group-hover:translate-y-0 md:h-48 md:w-48">
                        <CameraIcon className=" h-12 w-12 text-gray-300 md:h-24 md:w-24 " />
                    </button>

                    <Image
                        src={`/avatars/avatar.jpg`}
                        height={200}
                        width={200}
                        alt="avatar-image"
                    />
                </div>
            </div>
            {!showSettings && (
                <div className="col-span-2 flex items-center justify-center">
                    <Button onClick={() => setShowSettings(true)}>редактировать профиль</Button>
                </div>
            )}
            {showSettings && (
                <form
                    className="col-span-2 flex flex-col space-y-2 rounded bg-white p-2 shadow-md duration-200 hover:shadow-xl 2xl:space-y-4 2xl:p-8"
                    onSubmit={(e) => e.preventDefault()}
                >
                    <Input title="имя" dense placeholder="имя" />
                    <Input type="email" title="e-mail" dense placeholder="почта" />
                    <Input type="password" title="пароль" dense placeholder="пароль" />
                    <div className="flex justify-between">
                        <Button
                            onClick={() => setShowSettings(false)}
                            className="btn-xs  rounded border-rose-500 bg-rose-500 hover:border-rose-600 hover:bg-rose-600 2xl:btn-lg"
                        >
                            отмена
                        </Button>
                        <Button
                            type="submit"
                            className="btn-xs  rounded border-green-500 bg-green-500 hover:border-green-600 hover:bg-green-600 2xl:btn-lg"
                        >
                            сохранить
                        </Button>
                    </div>
                </form>
            )}
        </section>
    )
}

export default ProfileForm
