import dynamic from "next/dynamic";
import { useUnit } from "effector-react";
import { Fragment, useCallback, useState } from "react";

import { $currentSong, $files, changeSong, submitted, uploadFile } from "@/features/music";

import { Dialog, Transition } from "@headlessui/react";

import { Input } from "~/shared/ui/input";
import { Button } from "~/shared/ui/button";
import { InputFile } from "~/shared/ui/input-file";

import { UploadIcon } from "@heroicons/react/solid";
import { ModalActions, ModalTitle } from "~/shared/ui/dialog";

const PreviewImage = dynamic(() => import("../preview-image").then((mod) => mod.PreviewImage), {
  ssr: false,
});
const AudioPreview = dynamic(() => import("../audio-preview").then((mod) => mod.AudioPreview), {
  ssr: false,
});

export const UploadForm = () => {
  const currentSong = useUnit($currentSong);

  const [onUpload, onSubmit, onChange] = useUnit([uploadFile, submitted, changeSong]);

  const { image, music } = useUnit($files);

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
  );
};

export const UploadFormModal = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const toggleOpened = useCallback(() => setIsOpen((prev) => !prev), []);

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
              <ModalTitle>Загрузить трек</ModalTitle>

              <UploadForm />
              <ModalActions>
                <Button className="btn-sm" variant="error" onClick={toggleOpened}>
                  Отмена
                </Button>
                <Button className="btn-sm" variant="success" onClick={toggleOpened}>
                  сохранить
                </Button>
              </ModalActions>
            </div>
          </Transition.Child>
        </Dialog>
      </Transition>
    </>
  );
};
