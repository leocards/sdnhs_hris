import { useEffect, useState } from "react";
import useThrottle from "./useThrottle";

const useWindowSize = () => {
	const [windowWidth, setWindowWidth] = useState(window.innerWidth);

	const handleWindowResize = useThrottle(() => {
		setWindowWidth(window.innerWidth)
	}, 100);

	useEffect(() => {
		window.addEventListener("resize", handleWindowResize);

		return () => window.removeEventListener("resize", handleWindowResize);
	}, []);

    return {
        width: windowWidth
    }
};

const useElementResize = ({ el }: {el: HTMLElement}) => {
	const [elementWidth, setElementWidth] = useState(el.clientWidth);

	const handleElementResize = useThrottle(() => {
		setElementWidth(el.clientWidth)
	}, 100);

	useEffect(() => {
		el.addEventListener("resize", handleElementResize);

		return () => el.removeEventListener("resize", handleElementResize);
	}, []);

    return {
        width: elementWidth
    }
};

export {
    useElementResize
}

export default useWindowSize