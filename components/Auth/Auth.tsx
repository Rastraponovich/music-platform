import LoginFormModal from "../ui/LoginForm/LoginFormModal"

const Auth = () => {
    return (
        <div className=" col-span-4 col-end-11 flex items-center  space-x-2 justify-self-end text-xs md:col-span-2 md:col-end-13">
            <LoginFormModal />

            <div className="placeholder online avatar">
                <div className="w-12 rounded-full bg-neutral-focus text-neutral-content">
                    <span>W</span>
                </div>
            </div>
        </div>
    )
}

export default Auth
