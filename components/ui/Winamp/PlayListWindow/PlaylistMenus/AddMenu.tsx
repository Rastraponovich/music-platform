import WinampButton from "../../WinampButton"
import PlaylistMenu from "./PlaylistMenu"

interface AddMenuProps {}

const AddMenu = () => {
    return (
        <div className="relative ">
            <PlaylistMenu id="list-option">
                <WinampButton id="new-list" className=" h-[18px] w-[22px] cursor-winamp" />
                <WinampButton id="save-list" className=" h-[18px] w-[22px] cursor-winamp" />
                <WinampButton id="load-list" className=" h-[18px] w-[22px] cursor-winamp" />
            </PlaylistMenu>
        </div>
    )
}

export default AddMenu
