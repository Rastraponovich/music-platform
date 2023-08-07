import clsx from "clsx";
import type { ReactNode } from "react";
import { Dialog } from "@headlessui/react";

interface ModalProps {
  open: boolean;
  onClose(): void;
  children: ReactNode;
  className?: string;
}

export const Modal = ({ className, open, onClose, children }: ModalProps) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      className={clsx(className ? className : "fixed inset-0 z-50 overflow-y-auto p-4 pt-[25vh]")}
    >
      <Dialog.Overlay className="fixed inset-0 bg-gray-500/75" />
      {children}
    </Dialog>
  );
};

interface ModalActionsProps {
  children: ReactNode;
}

export const ModalActions = ({ children }: ModalActionsProps) => {
  return (
    <div className="flex justify-between rounded-b border-t border-t-gray-200 bg-gray-100 p-2">
      {children}
    </div>
  );
};

interface ModalTitleProps {
  children: ReactNode;
}

export const ModalTitle = ({ children }: ModalTitleProps) => {
  return (
    <Dialog.Title className="rounded-t border-b border-b-gray-200 bg-gray-100 p-2 capitalize text-gray-900">
      {children}
    </Dialog.Title>
  );
};
