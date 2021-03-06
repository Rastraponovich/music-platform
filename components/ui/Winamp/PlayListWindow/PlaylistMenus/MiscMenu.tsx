import PlaylistMenu from "./PlaylistMenu"

const MiscMenu = () => (
    <PlaylistMenu id="playlist-misc-menu">
        <div className="sort-list" onClick={(e) => e.stopPropagation()}>
            {/* <SortContextMenu /> */}
        </div>
        <div className="file-info" onClick={() => alert("Not supported in Webamp")} />

        <div className="misc-options" onClick={(e) => e.stopPropagation()}>
            {/* <MiscOptionsContextMenu /> */}
        </div>
    </PlaylistMenu>
)

export default MiscMenu
