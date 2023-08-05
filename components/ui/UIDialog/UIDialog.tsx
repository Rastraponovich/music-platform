import { Dialog } from "@headlessui/react";
import clsx from "clsx";
import React, { memo, ReactNode } from "react";

interface UIDialogProps {
  open: boolean;
  onClose(): void;
  children: ReactNode;
  className?: string;
}

const UIDialog = ({ className, open, onClose, children }: UIDialogProps) => {
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

export default memo(UIDialog);
