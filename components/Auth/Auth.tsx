import LoginFormModal from "../ui/LoginForm/LoginFormModal"

const Auth = () => {
    return (
        <div className="col-span-2 col-end-13 flex  items-center space-x-2 justify-self-end text-xs">
            <LoginFormModal />
            <div className=" h-8 w-8 rounded-full bg-black"></div>
        </div>
    )
}

export default Auth
