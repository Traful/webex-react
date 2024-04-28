import { useContext, useEffect, useRef } from "react";
import WebexContext from "./webexstore/WebexContext";

const Remote = () => {
	const wc = useContext(WebexContext);
	const refVideo = useRef(null);
	const refAudio = useRef(null);

	useEffect(() => {
		if(wc.state.media.remoteVideo && refVideo.current) {
			console.log("Ok video remoto");
			refVideo.current.srcObject = wc.state.media.remoteVideo;
		}
		if(wc.state.media.remoteAudio && refAudio.current) {
			refAudio.current.srcObject = wc.state.media.remoteAudio;
		}
	}, [wc.state.media.remoteVideo, wc.state.media.remoteAudio]);

	return(
		<div className="w-full h-full flex-auto">
			<audio ref={refAudio} autoPlay></audio>
			<video ref={refVideo} className="w-full h-full bg-gray-800" autoPlay></video>
		</div>
	);
};

export default Remote;