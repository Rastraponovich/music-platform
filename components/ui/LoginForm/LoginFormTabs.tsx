import { Tab } from "@headlessui/react"
import clsx from "clsx"
import LoginForm from "./LoginForm"
import RegistrationForm from "./RegistrationForm"

const LoginFormTabs = () => {
    return (
        <Tab.Panels>
            <Tab.Panel className={clsx(" bg-white p-3")}>
                <LoginForm />
            </Tab.Panel>

            <Tab.Panel className={clsx(" bg-white p-3")}>
                <RegistrationForm />
            </Tab.Panel>
        </Tab.Panels>
    )
}

export default LoginFormTabs
