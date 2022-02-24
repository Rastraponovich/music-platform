import { $currentSong, changeSong, searchTrack, submitted, uploadFile } from "@/features/music"
import { Dialog, Transition } from "@headlessui/react"
import { useEvent, useStore } from "effector-react"
import { Fragment, useState } from "react"

const UploadForm = () => {
    const currentSong = useStore($currentSong)

    const [onUpload, onSubmit, onChange, handleSearch] = useEvent([
        uploadFile,
        submitted,
        changeSong,
        searchTrack,
    ])

    const [isOpen, setIsOpen] = useState<boolean>(false)

    return (
        <>
            <button className="btn no-animation btn-xs" onClick={() => setIsOpen(true)}>
                uploadTrack
            </button>
            <Transition
                show={isOpen}
                as={Fragment}
                enter="transition duration-200 ease-out"
                enterFrom="transform scale-75 opacity-0"
                enterTo="transform scale-100 opacity-100"
                leave="transition duration-75 ease-out"
                leaveFrom="transform scale-100 opacity-100"
                leaveTo="transform scale-75 opacity-0"
            >
                <Dialog
                    className="fixed inset-0 z-50 overflow-y-auto p-4 pt-[25vh]"
                    open={isOpen}
                    onClose={() => setIsOpen(false)}
                >
                    <Dialog.Overlay className="fixed inset-0 bg-gray-500/50" />

                    <form
                        className=" relative mx-auto flex max-w-xl flex-col space-y-4 rounded bg-white p-4 shadow-lg"
                        onSubmit={onSubmit}
                    >
                        <Dialog.Title
                            as="h3"
                            className="  text-lg font-medium leading-6 text-gray-900"
                        >
                            Загрузить трек
                        </Dialog.Title>
                        <label className="flex flex-col">
                            <span>Название</span>
                            <input
                                type="text"
                                name="name"
                                value={currentSong.name}
                                onChange={onChange}
                                placeholder="Название..."
                                className="rounded border border-gray-400 p-2 text-gray-900 placeholder:text-gray-500"
                            />
                        </label>

                        <label className="flex flex-col">
                            <span>Автор</span>
                            <input
                                type="text"
                                name="artist"
                                value={currentSong.artist}
                                onChange={onChange}
                                placeholder="Артист..."
                                className="rounded border border-gray-400 p-2 text-gray-900 placeholder:text-gray-500"
                            />
                        </label>
                        <div className="grid grid-cols-2 gap-2 border-y border-y-gray-200 py-2">
                            <label>
                                <span>image</span>
                                <input type="file" name="image" onChange={onUpload} />
                            </label>
                            <label>
                                <span>music</span>
                                <input type="file" name="music" onChange={onUpload} />
                            </label>
                        </div>
                        <div className="flex justify-between">
                            <button
                                onClick={() => setIsOpen(false)}
                                className="btn no-animation btn-sm"
                            >
                                Отмена
                            </button>
                            <button type="submit" className="btn btn-primary no-animation btn-sm">
                                Сохранить
                            </button>
                        </div>
                    </form>
                </Dialog>
            </Transition>
        </>
    )
}

export default UploadForm
