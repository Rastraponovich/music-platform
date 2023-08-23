import { useUnit } from "effector-react";
import dynamic from "next/dynamic";
import { FormEventHandler, Fragment } from "react";

import { Button } from "~/shared/ui/button";
import { ModalActions, ModalTitle } from "~/shared/ui/dialog";
import { Input } from "~/shared/ui/input";
import { InputFile } from "~/shared/ui/input-file";

import {
  $artist,
  $artistErrorText,
  $audioFile,
  $coverFile,
  $modalOpened,
  $name,
  $nameErrorText,
  artistChanged,
  formReseted,
  formSubmitted,
  nameChanged,
  toggledModal,
  uploadedAudio,
  uploadedCover,
} from "./model";

import { Dialog, Transition } from "@headlessui/react";
import { UploadIcon } from "@heroicons/react/solid";

const PreviewImage = dynamic(
  () => import("@/components/preview-image").then((mod) => mod.PreviewImage),
  {
    ssr: false,
  },
);
const AudioPreview = dynamic(
  () => import("@/components/audio-preview").then((mod) => mod.AudioPreview),
  {
    ssr: false,
  },
);

export const UploadForm = () => {
  const [onSubmit, handleReset] = useUnit([formSubmitted, formReseted]);

  const handleSubmit: FormEventHandler = (event) => {
    event.preventDefault();
    onSubmit();
  };

  return (
    <form
      className=" relative mx-auto flex max-w-xl flex-col space-y-4 rounded bg-white p-4"
      id="upload-song-form"
      noValidate
      onSubmit={handleSubmit}
      onReset={handleReset}
    >
      <NameFormField />
      <ArtistFormField />

      <h3 className="text-xl font-bold">Загрузка файлов</h3>

      <div className="grid grid-cols-2 gap-2 rounded border border-gray-400 p-3">
        <CoverUpload />
        <AudioUpload />
      </div>
    </form>
  );
};

export const UploadFormModal = () => {
  const [open, toggleOpened] = useUnit([$modalOpened, toggledModal]);

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
      <Transition show={open} as={Fragment}>
        <Dialog
          className="fixed inset-0 z-50 overflow-y-auto p-4 pt-[10vh]"
          open={open}
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
                <Button className="btn-sm" variant="error" form="upload-song-form" type="reset">
                  Отмена
                </Button>
                <Button className="btn-sm" variant="success" form="upload-song-form" type="submit">
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

const NameFormField = () => {
  const [name, handleChange, error] = useUnit([$name, nameChanged, $nameErrorText]);

  return (
    <Input
      required
      name="name"
      value={name}
      title="Название"
      validateError={error}
      placeholder="Название..."
      onChangeValue={handleChange}
    />
  );
};

const ArtistFormField = () => {
  const [artist, handleChange, error] = useUnit([$artist, artistChanged, $artistErrorText]);

  return (
    <Input
      required
      name="artist"
      title="Автор"
      value={artist}
      validateError={error}
      placeholder="Артист..."
      onChangeValue={handleChange}
    />
  );
};

const CoverUpload = () => {
  const [image, onUpload] = useUnit([$coverFile, uploadedCover]);

  return (
    <div className="flex flex-col space-y-2">
      <InputFile
        type="file"
        name="image"
        title="Обложка"
        onValueChange={onUpload}
        dataFile={image ?? undefined}
        accept=".jpg, .png, .jpeg, .gif, .bmp, .tif, .tiff|image/*"
      />
      {image && <PreviewImage image={image} />}
    </div>
  );
};

const AudioUpload = () => {
  const [audio, onUpload] = useUnit([$audioFile, uploadedAudio]);

  return (
    <div className="flex flex-col space-y-2">
      <InputFile
        type="file"
        name="image"
        title="Обложка"
        onValueChange={onUpload}
        dataFile={audio ?? undefined}
        accept=".jpg, .png, .jpeg, .gif, .bmp, .tif, .tiff|image/*"
      />
      {audio && <AudioPreview audio={audio} />}
    </div>
  );
};
