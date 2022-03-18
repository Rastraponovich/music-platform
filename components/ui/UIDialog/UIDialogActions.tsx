import { ReactNode } from "react"

interface UIDialogActionsProps {
    children: ReactNode
}

const UIDialogActions = ({ children }: UIDialogActionsProps) => {
    return (
        <div className="flex justify-between rounded-b border-t border-t-gray-200 bg-gray-100 p-2">
            {children}
        </div>
    )
}

export default UIDialogActions
