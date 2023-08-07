import clsx from "clsx";
import Image from "next/image";
import { Fragment, memo, useEffect, useState } from "react";

import type { Tarif } from "@/types";
import { tarifCards } from "@/utils/__mock__";

import { Dialog, Transition } from "@headlessui/react";

import { BadgeCheckIcon } from "@heroicons/react/solid";

import { Input } from "~/shared/ui/input";
import { Button } from "~/shared/ui/button";

export const Tarifs = () => {
  const [checked, setChecked] = useState<Nullable<number>>(null);

  const [successPayment, setSuccessPayment] = useState(false);

  const [opened, setOpened] = useState(false);

  useEffect(() => {
    if (checked !== null) return setOpened(true);

    setOpened(false);

    return () => setOpened(false);
  }, [checked, opened]);

  useEffect(() => {
    if (!opened) return setSuccessPayment(false);

    return () => setSuccessPayment(false);
  }, [opened]);

  return (
    <section className="flex flex-col  bg-white px-5 py-10 sm:px-10 md:px-20">
      <h2 className="mb-4 text-3xl font-bold first-letter:uppercase">тарифы</h2>
      <div className="sm:gird-cols-1 grid gap-4 md:grid-cols-3">
        {tarifCards.map((tarif) => (
          <TarifCard
            key={tarif.id}
            tarif={tarif}
            setChecked={setChecked}
            checked={checked === tarif.id}
          />
        ))}
      </div>
      <Transition show={opened} as={Fragment}>
        <Dialog
          open={opened}
          onClose={() => setChecked(null)}
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
            <div className=" relative mx-auto flex max-w-xl flex-col  rounded bg-white  shadow-lg">
              <Dialog.Title className="rounded-t bg-gray-200 p-2 text-base font-semibold text-gray-900 first-letter:uppercase">
                оплата
              </Dialog.Title>
              {!successPayment && (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setSuccessPayment(true);
                  }}
                  className="space-y-2 p-4"
                >
                  <Input title="номер карты" dense />
                  <Input title="имя держателя" dense />
                  <Input title="срок действия карты" dense />
                  <Input title="CVC" dense />
                  <div className="flex justify-between">
                    <Button
                      className="btn-sm  rounded"
                      onClick={() => setChecked(null)}
                      variant="error"
                    >
                      отмена
                    </Button>
                    <Button type="submit" className="btn-sm  rounded" variant="success">
                      оплатить
                    </Button>
                  </div>
                </form>
              )}
              {successPayment && (
                <div className="flex w-full flex-col items-center justify-center p-4">
                  <div className="avatar  mb-2 flex items-center space-x-2 ">
                    <div className="rounded-full">
                      <Image src="/avatars/avatar.jpg" height={160} width="160" alt="image" />
                    </div>
                    <h3 className="text-2xl font-bold first-letter:uppercase">
                      ура! теперь ты с нами пидор
                    </h3>
                  </div>
                  <Button
                    variant="success"
                    className="border-green-500 bg-green-500 duration-150 hover:border-green-600 hover:bg-green-600"
                    onClick={() => setChecked(null)}
                  >
                    закрыть
                  </Button>
                </div>
              )}
            </div>
          </Transition.Child>
        </Dialog>
      </Transition>
    </section>
  );
};

interface TarifCardProps {
  tarif: Tarif;
  checked: boolean;
  setChecked: (id: number) => void;
}

const TarifCard = memo<TarifCardProps>(({ tarif, checked, setChecked }) => {
  return (
    <div
      className={clsx(
        "group flex flex-col justify-between space-y-4 rounded bg-gray-200 p-4 text-gray-900 shadow-sm duration-150 hover:text-white hover:shadow-lg",
        tarif.recomended && "indicator w-full",
        tarif.level === "standard" && " hover:bg-yellow-500",
        tarif.level === "start" && "hover:bg-blue-400",
        tarif.level === "super" && " hover:bg-green-600",
      )}
    >
      {tarif.recomended && (
        <span className="indicator-center indicator-item badge animate-pulse border-green-500 bg-green-500 group-hover:border-green-600 group-hover:bg-green-600 group-hover:shadow-xl md:indicator-end md:indicator-top">
          рекомендуется
        </span>
      )}
      <h3 className="text-2xl font-normal">{tarif.name}</h3>
      <p className="grow">{tarif.terms}</p>
      <span className="text-2xl font-bold before:content-['$']">{tarif.price}</span>
      <Button
        className="btn-outline btn-md  rounded border-gray-400 group-hover:btn group-hover:rounded"
        onClick={() => setChecked(tarif.id)}
      >
        {checked && <BadgeCheckIcon className="h-6 w-6 text-green-600" />}
        <span>{checked ? "ты пидор" : "стать пидором"}</span>
      </Button>
    </div>
  );
});

TarifCard.displayName = "TarifCard";
