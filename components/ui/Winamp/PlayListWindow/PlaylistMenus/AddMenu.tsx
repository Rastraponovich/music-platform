import { WinampButton } from "@/src/shared/ui/winamp/winamp-button";

import PlaylistMenu from "./PlaylistMenu";

const AddMenu = () => {
  return (
    <div className="relative ">
      <PlaylistMenu id="list-option">
        <WinampButton id="new-list" className=" h-[18px] w-[22px] cursor-winamp" />
        <WinampButton id="save-list" className=" h-[18px] w-[22px] cursor-winamp" />
        <WinampButton id="load-list" className=" h-[18px] w-[22px] cursor-winamp" />
      </PlaylistMenu>
    </div>
  );
};

export default AddMenu;
