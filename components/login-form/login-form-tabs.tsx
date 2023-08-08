import clsx from "clsx";

import { LoginForm } from "./login-form";
import { RegistrationForm } from "./registration-form";

import { Tab } from "@headlessui/react";

export const LoginFormTabs = () => {
  return (
    <Tab.Panels>
      <Tab.Panel className={clsx(" bg-white p-3")}>
        <LoginForm />
      </Tab.Panel>

      <Tab.Panel className={clsx(" bg-white p-3")}>
        <RegistrationForm />
      </Tab.Panel>
    </Tab.Panels>
  );
};
