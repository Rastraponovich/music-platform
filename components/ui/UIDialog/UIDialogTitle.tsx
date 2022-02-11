import { Dialog } from "@headlessui/react"
import { ReactNode } from "react"

interface UIDialogTitleProps {
    children: ReactNode
}

const UIDialogTitle = ({ children }: UIDialogTitleProps) => {
    return (
        <Dialog.Title className="rounded-t border-b border-b-gray-200 bg-gray-100 p-2 capitalize text-gray-900">
            {children}
        </Dialog.Title>
    )
}

export default UIDialogTitle
