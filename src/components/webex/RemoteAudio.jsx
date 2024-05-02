import { useContext, useEffect, useRef } from "react";
import WebexContext from "./webexstore/WebexContext";

const attachSinkId = async (element, sinkId) => {
	console.log(element, sinkId);
	if(typeof element.sinkId !== "undefined") {
		try {
			await element.setSinkId(sinkId);
		} catch (error) {
			let errorMessage = error;
			if (error.name === "SecurityError") {
				errorMessage = `You need to use HTTPS for selecting audio output device: ${error}`;
			}
			console.error(errorMessage);
		}
	} else {
		console.warn("Browser does not support output device selection.");
	}
};

const RemoteAudio = () => {
	const wc = useContext(WebexContext);
	const refAudio = useRef(null);

	useEffect(() => {
		if(wc.state.media.remoteAudio && refAudio.current) {
			refAudio.current.srcObject = wc.state.media.remoteAudio;
		}
	}, [wc.state.media.remoteAudio]);

	useEffect(() => {
		console.log(`Cambio salida de audio a ${wc.state.sinkId}`);
		if(wc.state.sinkId) {
			attachSinkId(refAudio.current, wc.state.sinkId);
		}
	}, [wc.state.sinkId]);

	return(
		<div className="RemoteAudio">
			<audio ref={refAudio} autoPlay></audio>
		</div>
	);
};

export default RemoteAudio;