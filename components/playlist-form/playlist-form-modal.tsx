import { Fragment, useCallback, useState } from "react";

import { Button } from "~/shared/ui/button";
import { ModalActions, ModalTitle } from "~/shared/ui/dialog";

import { PlaylistForm } from "./playlist-form";

import { Dialog, Transition } from "@headlessui/react";
import { DocumentAddIcon } from "@heroicons/react/outline";

export const PlaylistFormModal = () => {
  const [isOpened, setIsOpened] = useState<boolean>(false);

  const handleToggleOpened = useCallback(() => {
    setIsOpened((prev) => !prev);
  }, []);

  return (
    <>
      <Button
        className="btn-xs gap-2 hover:shadow-lg"
        onClick={handleToggleOpened}
        title="создать плейлист"
      >
        <DocumentAddIcon className="h-3 w-3 rounded-full bg-white p-[2px] text-gray-900" />
        создать плейлист
      </Button>

      <Transition show={isOpened} as={Fragment}>
        <Dialog
          open={isOpened}
          onClose={handleToggleOpened}
          className="fixed inset-0 z-50 overflow-y-auto p-4 pt-[10vh]"
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
              <ModalTitle>Новый плейлист</ModalTitle>

              <PlaylistForm />
              <ModalActions>
                <Button className="btn-sm" variant="error" onClick={handleToggleOpened}>
                  Отмена
                </Button>
                <Button className="btn-sm" variant="success" onClick={handleToggleOpened}>
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
