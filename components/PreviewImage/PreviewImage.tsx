import Image from "next/image"
import React, { memo, FC } from "react"

interface PreviewImageProps {
    image: File
}

const PreviewImage = ({ image }: PreviewImageProps) => {
    return (
        <div className="relative h-[200px] w-full border-2 border-dashed p-2">
            <Image src={URL.createObjectURL(image)} objectFit="cover" layout="fill" />
        </div>
    )
}

export default memo(PreviewImage)
