import clsx from "clsx"
import React, { memo, FC, InputHTMLAttributes } from "react"

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    title?: string
    validateError?: string
}

const Input = ({ title, validateError, ...props }: InputProps) => {
    return (
        <label className="flex flex-col ">
            <span
                className={clsx(
                    props.required && "after:ml-px after:font-bold after:content-['*']",
                    "mb-2"
                )}
            >
                {title}
            </span>
            <input
                {...props}
                className={clsx(
                    "mb-1 rounded border border-gray-400 p-2 text-gray-900 placeholder:text-gray-500 ",
                    validateError && "border-red-600 outline-red-600"
                )}
            />
            <span className="text-xs font-normal text-red-600">{validateError}</span>
        </label>
    )
}

export default memo(Input)
