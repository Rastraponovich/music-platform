import clsx from "clsx";
import { memo, ReactNode } from "react";

import { ChevronUpIcon } from "@heroicons/react/outline";
import { Disclosure, Transition } from "@headlessui/react";

interface AccordionFilterProps {
  title: string | ReactNode;
  children: ReactNode;
  divider?: boolean;
  className?: string;
}

export const AccordionFilter = memo<AccordionFilterProps>(
  ({ title, children, divider = false, className }) => {
    return (
      <Disclosure>
        {({ open }) => (
          <div className={clsx("mb-4 divide-y rounded bg-white", open && "shadow-xl", className)}>
            <Disclosure.Button
              className={clsx(
                "transition-[box-shadow] duration-500 ease-in-out hover:shadow-lg",
                "flex w-full justify-between rounded-lg bg-white  px-4 py-2 text-left text-sm font-medium text-gray-900  focus:outline-none ",
              )}
            >
              <span>{title}</span>
              <ChevronUpIcon
                className={clsx("h-5 w-5 text-gray-900", open && "rotate-180 transform")}
              />
            </Disclosure.Button>
            <Transition
              enter="transition duration-200 ease-out"
              enterFrom="transform scale-75 opacity-0"
              enterTo="transform scale-200 opacity-100"
              leave="transition duration-75 ease-out"
              leaveFrom="transform scale-200 opacity-100"
              leaveTo="transform scale-75 opacity-0"
            >
              <Disclosure.Panel
                className={clsx(
                  "mb-2   rounded bg-white px-4 pt-4 pb-2 text-sm text-gray-900",
                  divider && "divide-y divide-gray-200",
                )}
              >
                {children}
              </Disclosure.Panel>
            </Transition>
          </div>
        )}
      </Disclosure>
    );
  },
);
AccordionFilter.displayName = "AccordionFilter";
