import clsx from "clsx"
import { memo, InputHTMLAttributes } from "react"

interface InputFileProps extends InputHTMLAttributes<HTMLInputElement> {
    title: string
    dataFile?: File
}

const InputFile = ({ title, dataFile, ...props }: InputFileProps) => {
    return (
        <label className="flex flex-col space-y-2">
            <span>{title}</span>
            <input
                {...props}
                className={clsx(
                    "file:btn file:btn-xs file:no-animation file:mr-4 file:cursor-pointer hover:file:btn-primary",
                    "block w-full cursor-pointer text-sm text-gray-500"
                )}
            />
            {dataFile?.size && (
                <span className="text-xs  italic">
                    Размер файла: {(dataFile?.size / 1048576).toFixed(2)} Mb
                </span>
            )}
        </label>
    )
}

export default memo(InputFile)
