enum PopoverPanelPositons {
	TOPLEFT = "top start",
	TOPRIGHT = "top end",
	BOTTOMLEFT = "bottom start",
	BOTTOMRIGHT = "bottom end",
};

type POSITIONS = "TOPLEFT" | "TOPRIGHT" | "BOTTOMLEFT" | "BOTTOMRIGHT"

const transitions = {
    enter: "transition ease-out duration-200",
    enterFrom: "opacity-0 translate-y-1",
    enterTo: "opacity-100 translate-y-0",
    leave: "transition ease-in duration-150",
    leaveFrom: "opacity-100 translate-y-0",
    leaveTo: "opacity-0 translate-y-1",
};

export {
    PopoverPanelPositons,
    transitions,
    type POSITIONS
}