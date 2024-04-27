import { useContext, useEffect, useRef } from "react";
import WebexContext from "./webexstore/WebexContext";

const Local = () => {
	const wc = useContext(WebexContext);
	const refLocal = useRef(null);

	useEffect(() => {
		if(wc.state.media.local && refLocal.current) {
			refLocal.current.srcObject = wc.state.media.local;
		}
	}, [wc.state.media.local]);

	return(
		<div className="w-72 h-36 fixed right-2 bottom-2 bg-black">
			<video ref={refLocal} className="w-full h-full object-cover" autoPlay></video>
		</div>
	);
};

export default Local;