import { Fragment, useState } from "react"
import { Dialog, Transition } from "@headlessui/react"
import { XIcon } from "@heroicons/react/outline"
import { useStore, useEvent } from "effector-react"
import { $openedSidebar, toggleSidebar } from "@/features/sidebar"
import Navbar from "../ui/Navbar/Navbar"
import Link from "next/link"
import Image from "next/image"
import Auth from "../Auth/Auth"

const Sidebar = () => {
    const open = useStore($openedSidebar)
    const handleToggleSidebar = useEvent(toggleSidebar)

    return (
        <Transition.Root show={open} as={Fragment}>
            <Dialog
                as="div"
                className="fixed inset-0 z-50 overflow-hidden"
                onClose={handleToggleSidebar}
            >
                <div className="absolute inset-0 overflow-hidden">
                    <Transition.Child
                        as={Fragment}
                        enter="ease-in-out duration-500"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in-out duration-500"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <Dialog.Overlay className="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                    </Transition.Child>
                    <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                        <Transition.Child
                            as={Fragment}
                            enter="transform transition ease-in-out duration-500 sm:duration-700"
                            enterFrom="translate-x-full"
                            enterTo="translate-x-0"
                            leave="transform transition ease-in-out duration-500 sm:duration-700"
                            leaveFrom="translate-x-0"
                            leaveTo="translate-x-full"
                        >
                            <div className="pointer-events-auto relative w-screen max-w-md">
                                <Transition.Child
                                    as={Fragment}
                                    enter="ease-in-out duration-500"
                                    enterFrom="opacity-0"
                                    enterTo="opacity-100"
                                    leave="ease-in-out duration-500"
                                    leaveFrom="opacity-100"
                                    leaveTo="opacity-0"
                                >
                                    <div className="absolute top-0 left-0 -ml-8 flex pt-4 pr-2 sm:-ml-10 sm:pr-4">
                                        <button
                                            type="button"
                                            className="group w-8 p-1 text-[#2a2e37] marker:h-8 hover:animate-cross-spin hover:rounded-full hover:bg-[#2a2e37]"
                                            onClick={handleToggleSidebar}
                                        >
                                            <span className="sr-only">Close panel</span>
                                            <XIcon
                                                className="h-6 w-6 duration-150  group-hover:text-white"
                                                aria-hidden="true"
                                            />
                                        </button>
                                    </div>
                                </Transition.Child>
                                <div className="flex h-full flex-col overflow-y-scroll bg-white py-6 shadow-xl">
                                    <div className="flex items-center justify-between px-4 sm:px-6">
                                        <Dialog.Title className="text-lg font-medium text-gray-900">
                                            <Link href="/" shallow>
                                                <a className="flex items-center text-xl">
                                                    <Image
                                                        src="/img/winamp-logo.svg"
                                                        height={50}
                                                        width={50}
                                                        alt="Лого"
                                                    />
                                                    <h2>Шinamp</h2>
                                                </a>
                                            </Link>
                                        </Dialog.Title>
                                        <Auth />
                                    </div>
                                    <Navbar className="relative mt-6 flex-1 px-4 sm:px-6" />
                                </div>
                            </div>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>
    )
}

export default Sidebar
