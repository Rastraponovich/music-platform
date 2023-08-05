import dynamic from "next/dynamic"
import { useUnit } from "effector-react"

import { $currentSong, $files, changeSong, submitted, uploadFile } from "@/features/music"
import Input from "../ui/Input/Input"
import InputFile from "../ui/InputFile/InputFile"

const PreviewImage = dynamic(() => import("../PreviewImage/PreviewImage"), { ssr: false })

const AudioPreview = dynamic(() => import("../AudioPreview/AudioPreview"), { ssr: false })

const UploadForm = () => {
    const currentSong = useUnit($currentSong)

    const [onUpload, onSubmit, onChange] = useUnit([uploadFile, submitted, changeSong])

    const { image, music } = useUnit($files)

    return (
        <form
            className=" relative mx-auto flex max-w-xl flex-col space-y-4 rounded bg-white p-4"
            onSubmit={onSubmit}
        >
            <Input
                required
                name="name"
                value={currentSong.name}
                onChange={onChange}
                placeholder="Название..."
                title="Название"
                validateError={currentSong?.name?.length <= 0 ? "Поле должно быть заполнено" : ""}
            />
            <Input
                required
                name="artist"
                value={currentSong.artist}
                onChange={onChange}
                placeholder="Артист..."
                title="Автор"
                validateError={currentSong?.artist?.length <= 0 ? "Поле должно быть заполнено" : ""}
            />

            <h3 className="text-xl font-bold">Загрузка файлов</h3>

            <div className="grid grid-cols-2 gap-2 rounded border border-gray-400 p-3">
                <div className="flex flex-col space-y-2">
                    <InputFile
                        type="file"
                        name="image"
                        onChange={onUpload}
                        accept=".jpg, .png, .jpeg, .gif, .bmp, .tif, .tiff|image/*"
                        title="Обложка"
                        dataFile={image}
                    />
                    {image?.name?.length > 0 && <PreviewImage image={image} />}
                </div>
                <div className="flex flex-col items-start space-y-2">
                    <InputFile
                        type="file"
                        name="music"
                        onChange={onUpload}
                        accept=".mp3, .wav"
                        title="Трек"
                        dataFile={music}
                    />

                    {music?.name?.length > 0 && <AudioPreview audio={music} />}
                </div>
            </div>
        </form>
    )
}

export default UploadForm
