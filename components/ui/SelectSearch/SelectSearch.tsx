import clsx from "clsx";
import { ChangeEventHandler, ReactNode, memo } from "react";

import { Combobox } from "@headlessui/react";

interface SelectSearchProps {
  value: unknown;
  onChange: unknown;
  Icon?: ReactNode;
  onChangeValue: ChangeEventHandler<HTMLInputElement>;
  children: ReactNode;
  isOpened: boolean;
  onClick(): void;
}

const SelectSearch = ({
  onClick,
  value,
  onChange,
  Icon,
  onChangeValue,
  children,
  isOpened,
}: SelectSearchProps) => {
  return (
    <Combobox
      value={value}
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      onChange={onChange}
      onClick={onClick}
      as="div"
      className={clsx(
        "relative  max-w-xl divide-y divide-gray-100 overflow-hidden rounded bg-white  ring-1 ring-black/30 active:ring-blue-500",
        isOpened && "shadow-2xl",
      )}
    >
      <div className=" flex items-center px-4">
        {Icon}
        <Combobox.Input
          className="h-8 w-full border-0 bg-transparent text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-0 "
          placeholder="Поиск..."
          onChange={onChangeValue}
        />
      </div>

      <Combobox.Options static className="max-h-40 overflow-y-auto text-sm">
        {children}
      </Combobox.Options>
    </Combobox>
  );
};

export default memo(SelectSearch);
