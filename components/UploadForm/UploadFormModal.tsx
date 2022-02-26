import { Dialog, Transition } from "@headlessui/react"
import { Fragment, useCallback, useState } from "react"
import Button from "../ui/Button/Button"

import { UploadIcon } from "@heroicons/react/solid"
import UploadForm from "./UploadForm"
import UIDialogTitle from "../ui/UIDialog/UIDialogTitle"
import UIDialogActions from "../ui/UIDialog/UIDialogActions"

const UploadFormModal = () => {
    const [isOpen, setIsOpen] = useState<boolean>(false)

    const toggleOpened = useCallback(() => setIsOpen((prev) => !prev), [isOpen])

    return (
        <>
            <Button
                className="btn-xs gap-2 hover:shadow-lg"
                onClick={toggleOpened}
                title=" загрузить трек"
            >
                <UploadIcon className="h-3 w-3 rounded-full bg-white p-[2px] text-gray-900 " />
                загрузить трек
            </Button>
            <Transition show={isOpen} as={Fragment}>
                <Dialog
                    className="fixed inset-0 z-50 overflow-y-auto p-4 pt-[10vh]"
                    open={isOpen}
                    onClose={toggleOpened}
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
                            <UIDialogTitle>Загрузить трек</UIDialogTitle>

                            <UploadForm />
                            <UIDialogActions>
                                <Button className="btn-sm" variant="error" onClick={toggleOpened}>
                                    Отмена
                                </Button>
                                <Button className="btn-sm" variant="success" onClick={toggleOpened}>
                                    сохранить
                                </Button>
                            </UIDialogActions>
                        </div>
                    </Transition.Child>
                </Dialog>
            </Transition>
        </>
    )
}

export default UploadFormModal
