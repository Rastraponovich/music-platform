import clsx from "clsx";
import { useState, Fragment, useCallback, useRef } from "react";

import { Dialog, Tab, Transition } from "@headlessui/react";

import { XIcon } from "@heroicons/react/outline";

import { Button } from "~/shared/ui/button";
import { ModalTitle } from "~/shared/ui/dialog";
import { LoginFormTabs } from "./login-form-tabs";

export const LoginFormModal = () => {
  const [isOpened, setIsOpened] = useState<boolean>(false);

  const completeButtonRef = useRef<HTMLButtonElement>(null);
  const handleToggleOpened = useCallback(() => {
    setIsOpened((prev) => !prev);
  }, []);

  return (
    <>
      <Button
        className="btn-xs rounded hover:animate-pulse hover:shadow-lg"
        onClick={handleToggleOpened}
      >
        Авторизация
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
              <ModalTitle>
                <div className="flex items-center justify-between">
                  <span>авторизация</span>
                  <button
                    ref={completeButtonRef}
                    className="group w-8 p-1 text-gray-400 marker:h-8 hover:animate-cross-spin hover:rounded-full hover:bg-gray-500"
                    onClick={handleToggleOpened}
                  >
                    <XIcon className=" duration-150  group-hover:text-white" />
                  </button>
                </div>
              </ModalTitle>

              <Tab.Group>
                <Tab.List className="tabs flex-nowrap">
                  <Tab
                    className={({ selected }) =>
                      clsx("tab tab-lifted w-full", selected && "tab-active")
                    }
                  >
                    авторизация
                  </Tab>
                  <Tab
                    className={({ selected }) =>
                      clsx("tab tab-lifted w-full", selected && "tab-active")
                    }
                  >
                    регистрация
                  </Tab>
                </Tab.List>
                <LoginFormTabs />
              </Tab.Group>
            </div>
          </Transition.Child>
        </Dialog>
      </Transition>
    </>
  );
};
