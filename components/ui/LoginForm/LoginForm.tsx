import { ChangeEvent, useCallback, useState } from "react"
import Button from "../Button/Button"
import Input from "../Input/Input"

const LoginForm = () => {
    const [login, setLogin] = useState<string>("")
    const [password, setPassword] = useState<string>("")

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
            <Button type="submit" className="btn-wide btn-md self-center" variant="success">
                Вход
            </Button>
        </form>
    )
}

export default LoginForm
