import { Dialog, Transition } from "@headlessui/react"

import React, { useState, Fragment, useCallback, ChangeEvent } from "react"
import Button from "../Button/Button"
import Input from "../Input/Input"
import UIDialogActions from "../UIDialog/UIDialogActions"
import UIDialogTitle from "../UIDialog/UIDialogTitle"
import LoginForm from "./LoginForm"

const LoginFormModal = () => {
    const [isOpened, setIsOpened] = useState<boolean>(false)

    const handleToggleOpened = useCallback(() => {
        setIsOpened((prev) => !prev)
    }, [isOpened])

    return (
        <>
            <Button className="btn-xs rounded hover:shadow-lg" onClick={handleToggleOpened}>
                Авторизация
            </Button>

            <Transition show={isOpened} as={Fragment}>
                <Dialog
                    open={isOpened}
                    onClose={handleToggleOpened}
                    className="fixed inset-0 z-50 overflow-y-auto p-4 pt-[10vh]"
                >
                    <Transition.Child
                        as={Fragment}
                        enter="transition duration-200 ease-out"
                        enterFrom="transform opacity-0"
                        enterTo="transform opacity-100"
                        leave="transition duration-150 ease-out"
                        leaveFrom="transform opacity-100"
                        leaveTo="transform opacity-0"
                    >
                        <Dialog.Overlay className="fixed inset-0 bg-gray-500/75" />
                    </Transition.Child>

                    <Transition.Child
                        as={Fragment}
                        enter="transition duration-200 ease-out"
                        enterFrom="transform scale-75 opacity-0"
                        enterTo="transform scale-100 opacity-100"
                        leave="transition duration-150 ease-out"
                        leaveFrom="transform scale-100 opacity-100"
                        leaveTo="transform scale-75 opacity-0"
                    >
                        <div className=" relative mx-auto flex max-w-xl flex-col rounded bg-white shadow-lg">
                            <UIDialogTitle>Вход</UIDialogTitle>
                            <LoginForm />
                        </div>
                    </Transition.Child>
                </Dialog>
            </Transition>
        </>
    )
}

export default LoginFormModal
