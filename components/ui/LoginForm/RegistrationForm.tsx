import { ChangeEvent, useCallback, useState } from "react"
import Button from "../Button/Button"
import Input from "../Input/Input"

const RegistrationForm = () => {
    const [login, setLogin] = useState<string>("")
    const [password, setPassword] = useState<string>("")

    const [checked, setChecked] = useState<boolean>(false)

    const handleChangeLogin = useCallback(
        (e: ChangeEvent<HTMLInputElement>) => {
            setLogin(e.target.value)
        },
        [login]
    )

    const handleChangePassword = useCallback(
        (e: ChangeEvent<HTMLInputElement>) => {
            setPassword(e.target.value)
        },
        [password]
    )

    return (
        <form onSubmit={(e) => e.preventDefault()} className="flex flex-col space-y-2 p-4">
            <Input
                value={login}
                title="Логин"
                placeholder="Логин.."
                onChange={handleChangeLogin}
                required
            />
            <Input
                type="password"
                value={password}
                title="Пароль"
                placeholder="Пароль.."
                onChange={handleChangePassword}
                required
            />

            <Input
                type="password"
                value={password}
                title="Пароль"
                placeholder="повтор пароля.."
                onChange={handleChangePassword}
                required
            />

            <label className="flex flex-row-reverse items-center justify-end ">
                <span className="ml-2 select-none">правила портала</span>

                <input type="checkbox" onChange={() => setChecked(!checked)} checked={checked} />
            </label>
            <Button type="submit" className="btn-wide btn-md self-center" variant="success">
                регистрация
            </Button>
        </form>
    )
}

export default RegistrationForm
