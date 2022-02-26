import clsx from "clsx"
import React, { memo, FC, ButtonHTMLAttributes, ReactNode } from "react"

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode
    variant?: TButtonVariant
}

type TButtonVariant = "error" | "success" | "default"

const Button = ({ children, variant = "default", className, ...props }: ButtonProps) => {
    return (
        <button
            {...props}
            className={clsx(
                "btn no-animation",
                className,

                variant === "success" && "hover:border-green-600 hover:bg-green-600",
                variant === "error" && "hover:border-red-600 hover:bg-red-600"
            )}
        >
            {children}
        </button>
    )
}

export default memo(Button)
