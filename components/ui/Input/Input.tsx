import clsx from "clsx"
import React, { memo, InputHTMLAttributes } from "react"

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    title?: string
    validateError?: string
    dense?: boolean
}

const Input = ({ title, validateError, dense = false, ...props }: InputProps) => {
    return (
        <label className="flex flex-col ">
            <span
                className={clsx(
                    "first-letter:uppercase",
                    props.required && "after:ml-px after:font-bold after:content-['*']",
                    dense
                        ? "mb-1 text-xs 2xl:mb-2 2xl:text-xl"
                        : "mb-2 text-sm 2xl:mb-4 2xl:text-3xl"
                )}
            >
                {title}
            </span>
            <input
                {...props}
                className={clsx(
                    "mb-1 rounded border border-gray-400  px-2 text-gray-900 placeholder:text-gray-500 placeholder:first-letter:uppercase",
                    validateError && "border-red-600 outline-red-600",
                    dense
                        ? "2xl-py-4 py-1 text-xs 2xl:text-xl"
                        : "py-2 text-sm 2xl:py-8 2xl:text-3xl"
                )}
            />
            <span className="text-xs font-normal text-red-600 2xl:text-xl">{validateError}</span>
        </label>
    )
}

export default memo(Input)
